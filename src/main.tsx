import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/gate/page";
import { Auth } from "./pages/auth/page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/:value" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
