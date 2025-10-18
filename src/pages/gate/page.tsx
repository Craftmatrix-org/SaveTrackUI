import { Button } from "@/components/ui/button";

export function Login() {
  const LoginViaCMX = () => {
    window.location.href = "https://bridge.craftmatrix.org/auth/?app=savetrack";
  };
  return <Button onClick={LoginViaCMX}>Login With Craftmatrix</Button>;
}
