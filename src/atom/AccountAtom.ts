import axios from "axios";
import { atom } from "jotai";
import { getTokenDataFromCookie } from "../api/token";

type TypePayload = {
  id: string;
  userID: string;
  label: string;
  description: string;
  initValue: number;
  createdAt: string;
  updatedAt: string;
};

// Atom to store account data
export const AtomAccount = atom<TypePayload[]>([]);

// Atom to fetch account data and update AtomAccount
export const AtomFetchAccount = atom(
  (get) => get(AtomAccount),
  async (get, set) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Account/${getTokenDataFromCookie()?.uid}`,
      );
      const account: TypePayload[] = response.data;
      set(AtomAccount, account);
    } catch (error) {
      console.error("Failed to fetch account:", error);
      set(AtomAccount, []);
    }
  },
);
