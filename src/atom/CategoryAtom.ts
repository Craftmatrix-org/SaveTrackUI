import axios from "axios";
import { atom } from "jotai";
import { getTokenDataFromCookie } from "../api/token";
import { CategoryType } from "../types/CategoryType";

export const AtomCategory = atom<CategoryType[]>([]);

export const AtomFetchCategory = atom(
  (get) => get(AtomCategory),
  // @ts-expect-error not an error
  async (get, set) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Category/${getTokenDataFromCookie()?.uid}`,
      );
      const account: CategoryType[] = response.data;
      set(AtomCategory, account);
    } catch (error) {
      console.error("Failed to fetch account:", error);
      set(AtomCategory, []);
    }
  },
);
