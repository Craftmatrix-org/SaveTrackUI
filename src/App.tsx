import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { GatePage } from "./pages/Gate/page";
import { getTokenDataFromCookie } from "./api/token";
import { Transaction } from "./pages/Dashboard/transactions/page";
import Layout from "./custom-component/layout";
import { Categories } from "./pages/Dashboard/categories/page";
import { Account } from "./pages/Dashboard/accounts/page";

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
          <Route
            path="/records"
            element={
              <Layout>
                <Transaction />
              </Layout>
            }
          />
          <Route
            path="/category"
            element={
              <Layout>
                <Categories />
              </Layout>
            }
          />
          <Route
            path="/account"
            element={
              <Layout>
                <Account />
              </Layout>
            }
          />
          <Route
            path="/account/debit"
            element={
              <Layout>
                <Account />
              </Layout>
            }
          />
          {/* <Route
            path="/charts"
            element={
              <Layout>
                <h1>Charts</h1>
              </Layout>
            }
          />
          <Route
            path="/budget"
            element={
              <Layout>
                <h1>Budget</h1>
              </Layout>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
