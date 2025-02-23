import { useAtom } from "jotai";
import { AtomEmail } from "../../atom/GateAtom";
import { useEffect } from "react";
import axios from "axios";

export const Dashboard = () => {
  const [email] = useAtom(AtomEmail);

  // must be all in one API
  // check email if exist in database
  // if true generate token
  // else register, and then post the new email, then generate token

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5184/api/v1/UserToken/${email}`,
        );
        document.cookie = `token=${response.data}; path=/`;
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    if (email) {
      fetchToken();
    }
  }, [email]);

  return (
    <>
      <h1>Dashboard</h1>
      <p>Email: {email}</p>
    </>
  );
};
