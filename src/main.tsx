import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/app.css";
import "./styles/ios.css";
import { initializeNative, isNative } from "./lib/native";

void initializeNative().catch((error) => console.warn("iOS initialization:", error));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.PROD && !isNative && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => null);
  });
}
