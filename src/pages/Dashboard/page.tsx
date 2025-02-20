import { useAtom } from "jotai";
import { AtomEmail } from "../../atom/GateAtom";

export const Dashboard = () => {
  const [email] = useAtom(AtomEmail);

  // must be all in one API
  // check email if exist in database
  // if true generate token
  // else register, and then post the new email, then generate token

  return (
    <>
      <h1>Dashboard</h1>
      <p>Email: {email}</p>
    </>
  );
};
