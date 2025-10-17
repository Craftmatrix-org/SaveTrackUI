import { Button, Card } from "@radix-ui/themes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { AtomEmail } from "../../atom/GateAtom"; // Correct import path
import { getTokenDataFromCookie } from "../../api/token";

export const GatePage = () => {
  const [, setEmail] = useAtom(AtomEmail);

  const nav = useNavigate();

  useEffect(() => {
    const tokenData = getTokenDataFromCookie();
    if (tokenData) {
      nav("/records");
    }
  }, [nav, setEmail]);

  const getAccessToken = () => {
    const redi = "https://bridge.craftmatrix.org/auth/?app=savetrack";
    window.location.href = redi;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Extract the 'jwt' query parameter
    const jwt = params.get("jwt");
    if (jwt) {
      alert(jwt);
      console.log(jwt);
    } else {
      alert("No JWT found in the URL!");
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
