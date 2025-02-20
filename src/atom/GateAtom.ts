import { atomWithStorage } from "jotai/utils";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_HASH_SECURED_KEY; // Replace with your actual secret key

// Atom with custom get and set to handle hashing and unhashing
export const AtomEmail = atomWithStorage<string | null>("email", "", {
  getItem: (key) => {
    const hashedEmail = localStorage.getItem(key);
    if (hashedEmail) {
      const bytes = CryptoJS.AES.decrypt(hashedEmail, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return "";
  },
  setItem: (key, newValue) => {
    if (newValue) {
      const hashedEmail = CryptoJS.AES.encrypt(newValue, secretKey).toString();
      localStorage.setItem(key, hashedEmail);
    } else {
      localStorage.removeItem(key);
    }
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
});
