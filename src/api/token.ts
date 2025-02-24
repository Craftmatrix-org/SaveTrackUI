import { jwtDecode } from "jwt-decode";

// Define the interface for the token payload
interface TokenPayload {
  sub: string;
  jti: string;
  uid: string;
  exp: number;
  iss: string;
  aud: string;
}

// Function to get a cookie value by name
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return match[2];
  }
  return null;
}

// Function to extract data from the token
function getTokenData(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token);
}

// Export functions
export const getTokenDataFromCookie = (): TokenPayload | null => {
  const token = getCookie("token");
  if (token) {
    return getTokenData(token);
  }
  return null;
};
