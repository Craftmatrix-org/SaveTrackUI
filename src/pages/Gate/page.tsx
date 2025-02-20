import { Button, Card } from "@radix-ui/themes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { AtomEmail } from "../../atom/GateAtom"; // Correct import path

const client_id = import.meta.env.VITE_CLIENT_ID;
const redirect_uri = window.origin;

export const GatePage = () => {
  const [, setEmail] = useAtom(AtomEmail);

  const getEmail = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=email`;
    window.location.href = authUrl;
  };

  const nav = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token) {
        fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
        )
          .then((response) => response.json())
          .then((data) => {
            setEmail(data.email);
            console.log("Email:", data.email);
            nav("/dashboard");
          })
          .catch((error) => console.error("Error fetching email:", error));
      }
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
          <Button variant="solid" className="mb-2" onClick={getEmail}>
            Login with Google
          </Button>
          <Button variant="outline">
            <a href="/terms-and-conditions">Terms and Conditions</a>
          </Button>
        </div>
      </Card>
    </div>
  );
};
