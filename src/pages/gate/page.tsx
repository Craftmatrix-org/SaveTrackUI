import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "@/lib/token";

export function Login() {
  const nav = useNavigate();
  const LoginViaCMX = () => {
    window.location.href = "https://bridge.craftmatrix.org/auth/?app=savetrack";
  };

  const jwt = new URLSearchParams(window.location.search).get("jwt");

  useEffect(() => {
    // Check for existing token in cookie
    const existingToken = getCookie("token");
    if (existingToken) {
      nav("/record");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;

    const validateToken = async () => {
      if (!jwt) return;

      try {
        const response = await axios.get(`${API_URL}/api/v2/Auth/validate`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        console.log("Validation success:", response.data);
        nav(`/auth/${response.data.token}`);
      } catch (error) {
        console.error("Validation failed:", error);
      }
    };

    validateToken();
  }, [jwt, nav]);

  return <Button onClick={LoginViaCMX}>Login With Craftmatrix</Button>;
}
