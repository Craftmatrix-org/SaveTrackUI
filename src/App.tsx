import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GatePage } from "./pages/Gate/page";
import { Dashboard } from "./pages/Dashboard/page";

function App() {
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
