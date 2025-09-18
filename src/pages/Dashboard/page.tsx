import { useAtom } from "jotai";
import { AtomEmail } from "../../atom/GateAtom";
import { useEffect } from "react";
import axios from "axios";
import { Box, Tabs } from "@radix-ui/themes";
import { Account } from "./accounts/page";
import { Categories } from "./categories/page";
import { Transaction } from "./transactions/page";

export const Dashboard = () => {
  const [email] = useAtom(AtomEmail);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/UserToken/${email}`,
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
      <Tabs.Root defaultValue="transaction">
        <Tabs.List>
          <Tabs.Trigger value="transaction">Transaction</Tabs.Trigger>
          <Tabs.Trigger value="category">Category</Tabs.Trigger>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>

        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="transaction">
            <Transaction />
          </Tabs.Content>

          <Tabs.Content value="category">
            <Categories />
          </Tabs.Content>

          <Tabs.Content value="account">
            <Account />
          </Tabs.Content>
          <Tabs.Content value="setting">
            Account
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </>
  );
};
