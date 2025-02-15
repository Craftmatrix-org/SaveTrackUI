import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme accentColor="tomato" radius="small" appearance="dark">
      <App />
    </Theme>
  </StrictMode>,
);
