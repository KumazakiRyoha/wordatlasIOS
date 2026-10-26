#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Xcode compilation runs on macOS. From Windows, use the Build iPhone IPA GitHub workflow." >&2
  exit 1
fi

mkdir -p build
xcodebuild \
  -project ios/App/App.xcodeproj \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath build/DerivedData \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY='' \
  build 2>&1 | tee build/ios-build.log

app='build/DerivedData/Build/Products/Release-iphoneos/App.app'
test -f "$app/Info.plist"
test -f "$app/public/index.html"
test -f "$app/public/atlas/index.json"
test -f "$app/PrivacyInfo.xcprivacy"

# mktemp avoids modifying a previous package when this script is rerun locally.
package_dir="$(mktemp -d "$PWD/build/ios-package.XXXXXX")"
trap 'rm -rf -- "$package_dir"' EXIT
mkdir -p "$package_dir/Payload"
cp -R "$app" "$package_dir/Payload/App.app"
(
  cd "$package_dir"
  /usr/bin/zip -qry WordAtlas-unsigned.ipa Payload
)
mv -f "$package_dir/WordAtlas-unsigned.ipa" build/WordAtlas-unsigned.ipa
(
  cd build
  shasum -a 256 WordAtlas-unsigned.ipa > WordAtlas-unsigned.ipa.sha256
)
echo "Created build/WordAtlas-unsigned.ipa; sign with your own Apple account before installation."
