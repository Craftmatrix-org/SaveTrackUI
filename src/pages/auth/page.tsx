import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie, saveTokenToCookie } from "@/lib/token";

export const Auth = () => {
  const { value } = useParams();
  const nav = useNavigate();
  // Save token from the URL param
  useEffect(() => {
    if (value) {
      console.log("Saving token:", value);
      saveTokenToCookie(value);
    }
  }, [value]);

  // Check if the cookie exists and alert once
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      nav("/record");
    }
  }, []); // runs once after mount

  return <div>Param: {value}</div>;
};
