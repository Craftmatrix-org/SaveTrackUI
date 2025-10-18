import { saveTokenToCookie } from "@/lib/token";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const Auth = () => {
  const { value } = useParams();

  useEffect(() => {
    if (value) {
      console.log("Value:", value);
      saveTokenToCookie(value);
    }
  }, [value]); // only run when 'value' changes

  return <div>Param: {value}</div>;
};
