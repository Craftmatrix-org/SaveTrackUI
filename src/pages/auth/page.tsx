import { useParams } from "react-router-dom";

export const Auth = () => {
  const { value } = useParams();

  console.log("Value:", value);

  return <div>Param: {value}</div>;
};
