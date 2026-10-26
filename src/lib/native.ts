import { Capacitor } from "@capacitor/core";

export const isNative = Capacitor.isNativePlatform();

/** Native adapters stay out of the web startup and preserve the original UI. */
export async function initializeNative() {
  if (!isNative) return;
  document.documentElement.classList.add("is-native");
  const { Keyboard } = await import("@capacitor/keyboard");
  await Keyboard.addListener("keyboardWillShow", () => {
    document.documentElement.classList.add("keyboard-open");
  });
  await Keyboard.addListener("keyboardWillHide", () => {
    document.documentElement.classList.remove("keyboard-open");
  });
}

export async function updateNativeTheme(dark: boolean) {
  if (!isNative) return;
  const { StatusBar, Style } = await import("@capacitor/status-bar");
  await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
}

/** Share a real file so iOS can save backups to Files or AirDrop them. */
export async function saveBackup(contents: string, filename: string) {
  if (isNative) {
    const [{ Filesystem, Directory, Encoding }, { Share }] = await Promise.all([
      import("@capacitor/filesystem"),
      import("@capacitor/share"),
    ]);
    const result = await Filesystem.writeFile({
      path: filename,
      data: contents,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    await Share.share({ title: "词光学习备份", files: [result.uri] });
    return;
  }
  const url = URL.createObjectURL(new Blob([contents], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
