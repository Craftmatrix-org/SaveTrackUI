import { Button } from "@radix-ui/themes"

export const Settings = () => {
  const logout = () => {
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  }
  return (<>
    <Button
      onClick={() => {
        logout()
      }}
    >Logout</Button>
  </>)
}
