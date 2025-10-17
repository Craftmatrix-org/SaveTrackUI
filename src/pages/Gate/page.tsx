import { Button, Card } from "@radix-ui/themes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { AtomEmail } from "../../atom/GateAtom";
import { getTokenDataFromCookie, saveTokenToCookie } from "../../api/token";
import axios from "axios";

export const GatePage = () => {
  const [, setEmail] = useAtom(AtomEmail);
  const nav = useNavigate();

  // 🔍 Validate token via API
  async function validateToken(bearer: string) {
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.get(`${API_URL}/api/v2/Auth/validate`, {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      });

      const result = response.data;
      console.log("✅ Token validation result:", result);

      // 💾 Save token to cookie if valid
      if (result.valid) {
        saveTokenToCookie(bearer);
        setEmail(result.email); // optionally store email
        alert("Token validated and saved!");
        nav("/records");
      } else {
        alert("Token invalid!");
      }

      return result;
    } catch (error) {
      console.error("❌ Token validation failed:", error);
      alert("Token validation failed!");
      return null;
    }
  }

  // 🔗 Redirect to login
  const getAccessToken = () => {
    const redi = "https://bridge.craftmatrix.org/auth/?app=savetrack";
    window.location.href = redi;
  };

  // 🧭 On load: check cookie
  useEffect(() => {
    const tokenData = getTokenDataFromCookie();
    if (tokenData) {
      console.log("✅ Found token cookie:", tokenData);
      nav("/records");
    }
  }, [nav, setEmail]);

  // 🔎 On load: check if ?jwt= exists in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwt = params.get("jwt");

    if (jwt) {
      validateToken(jwt);
    }
  }, [nav, setEmail]);

  return (
    <div className="h-screen flex">
      <Card className="m-auto">
        <div className="bg-[white] h-[250px] border-[2px] rounded-[10px]"></div>
        <h1 className="font-bold text-2xl text-center">
          Master Your Finances: Plan, Manage, Succeed
        </h1>
        <p className="text-center text-gray-600">
          Take control of your financial future with our comprehensive tools and
          resources.
        </p>
        <div className="flex flex-col gap-1 p-2">
          <Button onClick={getAccessToken}>Login with Craftmatrix</Button>
          <Button variant="outline">
            <a href="/terms-and-conditions">Terms and Conditions</a>
          </Button>
        </div>
      </Card>
    </div>
  );
};
