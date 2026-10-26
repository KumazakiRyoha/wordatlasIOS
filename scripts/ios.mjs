import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

// Works with npm and pnpm, including Windows, without shell-specific env syntax.
function run(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const cap = "node_modules/@capacitor/cli/bin/capacitor";
const action = process.argv[2] ?? "sync";
if (!["build", "sync", "open"].includes(action)) throw new Error(`Unknown action: ${action}`);
if (action === "open") {
  if (process.platform !== "darwin") throw new Error("Opening Xcode requires macOS. See docs/ios.md.");
  run(cap, ["open", "ios"]);
} else {
  run("node_modules/typescript/bin/tsc", ["-b"]);
  run("node_modules/vite/bin/vite.js", ["build", "--mode", "ios"]);
  if (action === "sync") {
    if (!existsSync("ios")) run(cap, ["add", "ios", "--packagemanager", "SPM"]);
    run(cap, ["sync", "ios"]);
  }
}
