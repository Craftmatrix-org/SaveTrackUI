import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { GatePage } from "./pages/Gate/page";
import { Dashboard } from "./pages/Dashboard/page";
import { getTokenDataFromCookie } from "./api/token";

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.location.pathname !== "/" && !getTokenDataFromCookie()) {
        window.location.href = "/";
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GatePage />} />
          <Route path="/env" element={<div>{import.meta.env.VITE_ENV}</div>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
