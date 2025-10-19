import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/gate/page";
import { Auth } from "./pages/auth/page";
import { ProtectedRoute } from "./pages/gate/keeper";
import { Records } from "./pages/Feats/Records/page";
import Layout from "./pages/templates/layout";
import { Category } from "./pages/Feats/Category/Category";
import { Account } from "./pages/Feats/Account/page";
import { Bills } from "./pages/Feats/Bills/page";
import { Chat } from "./pages/Feats/Chat/page";
import { Settings } from "./pages/Feats/Settings/page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/:value" element={<Auth />} />

        <Route
          path="/record"
          element={
            <ProtectedRoute>
              <Layout>
                <Records />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Layout>
                <Category />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Layout>
                <Account />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Layout>
                <Bills />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <Chat />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
