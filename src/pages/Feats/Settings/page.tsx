import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getTokenDataFromCookie } from "@/lib/token";
import { useNavigate } from "react-router-dom";

export const Settings = () => {
  const userData = getTokenDataFromCookie();
  const nav = useNavigate();
  return (
    <>
      <div>
        <Label>{userData?.sub}</Label>
      </div>
      <Button
        onClick={() => {
          nav("/logout");
        }}
      >
        Logout
      </Button>

      <div>
        <section>Subscription Comming Soon</section>
      </div>
    </>
  );
};
