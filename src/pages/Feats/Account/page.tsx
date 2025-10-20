import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "@/lib/token";
import type { AccountItem } from "@/types/account";
import axios from "axios";
import { useEffect, useState } from "react";
import { CreateAccount } from "./crud/create";

export const Account = () => {
  const token = getCookie("token");
  const [account, setAccount] = useState<AccountItem[]>([]);

  useEffect(() => {
    if (!token) return;
    const getData = async () => {
      try {
        const response = await axios.get<AccountItem[]>(
          `${import.meta.env.VITE_API_URL}/api/v2/Account`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );
        setAccount(response.data);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      }
    };
    getData();
  }, [token]);

  return (
    <>
      <CreateAccount />
      <div className="flex gap-1 flex-col">
        {account.map((cat) => (
          <Card key={cat.id}>
            <CardHeader>
              <CardTitle>{cat.label}</CardTitle>
              <CardTitle>{cat.total}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};
