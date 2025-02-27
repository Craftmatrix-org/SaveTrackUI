import { TabNav } from "@radix-ui/themes";
import { useNavigate, useLocation } from "react-router-dom";

export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstPath = location.pathname.split("/")[1];

  return (
    <main>
      <TabNav.Root>
        {/* <TabNav.Link
          onClick={() => navigate("/charts")}
          active={firstPath === "charts"}
        >
          Charts
        </TabNav.Link> */}
        <TabNav.Link
          onClick={() => navigate("/records")}
          active={firstPath === "records"}
        >
          Records
        </TabNav.Link>
        <TabNav.Link
          onClick={() => navigate("/category")}
          active={firstPath === "category"}
        >
          Category
        </TabNav.Link>
        <TabNav.Link
          onClick={() => navigate("/account")}
          active={firstPath === "account"}
        >
          Account
        </TabNav.Link>
        {/* <TabNav.Link
          onClick={() => navigate("/budget")}
          active={firstPath === "budget"}
        >
          Budget
        </TabNav.Link> */}
      </TabNav.Root>
    </main>
  );
};
