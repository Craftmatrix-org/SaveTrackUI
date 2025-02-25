import axios from "axios";
import { atom } from "jotai";
import { getTokenDataFromCookie } from "../api/token";
import { TransactionType } from "../types/TransactionType";

export const AtomTransaction = atom<TransactionType[]>([]);

export const AtomFetchTransaction = atom(
  (get) => get(AtomTransaction),
  // @ts-expect-error not an error
  async (get, set) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Transaction/${getTokenDataFromCookie()?.uid}`,
      );
      const account: TransactionType[] = response.data;
      set(AtomTransaction, account);
    } catch (error) {
      console.error("Failed to fetch account:", error);
      set(AtomTransaction, []);
    }
  },
);
