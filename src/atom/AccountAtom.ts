import axios from "axios";
import { atom } from "jotai";
import { getCookie, getTokenDataFromCookie } from "../api/token";
import { TypePayload } from "../types/AccountType";

// Atom to store account data
export const AtomAccount = atom<TypePayload[]>([]);

// Atom to fetch account data and update AtomAccount
export const AtomFetchAccount = atom(
  (get) => get(AtomAccount),
  // @ts-expect-error not an error
  async (get, set) => {
    try {
      const token = getCookie("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Account/${getTokenDataFromCookie()?.jti}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      const account: TypePayload[] = response.data;
      set(AtomAccount, account);
    } catch {
      // console.error("Failed to fetch account:", error);
      set(AtomAccount, []);
    }
  },
);
