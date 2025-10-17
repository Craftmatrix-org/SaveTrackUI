import { jwtDecode } from "jwt-decode";

// Define the interface for the token payload
interface TokenPayload {
  sub: string;
  role: string;
  jti: string;
  exp: number;
  iss: string;
  aud: string;
}

// Function to get a cookie value by name
export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return match[2];
  }
  return null;
};

// 🆕 Function to set a cookie (save token)
export const saveTokenToCookie = (token: string, days = 7): void => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString(); // 7 days default
  document.cookie = `token=${token}; expires=${expires}; path=/; Secure; SameSite=Strict`;
};

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
