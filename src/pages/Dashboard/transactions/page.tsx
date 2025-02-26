import {
  Avatar,
  Badge,
  Box,
  // Button,
  Card,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Add } from "./crud/add";
import { useAtom, useSetAtom } from "jotai";
import {
  AtomFetchTransaction,
  AtomTransaction,
} from "../../../atom/TransactionAtom";
import { getTokenDataFromCookie } from "../../../api/token";
import { useEffect, useState } from "react";
import { Edit } from "./crud/edit";
import { Delete } from "./crud/delete";

export const Transaction = () => {
  const [transactions] = useAtom(AtomTransaction);
  const fetchTransactions = useSetAtom(AtomFetchTransaction);
  const [searchTerm, setSearchTerm] = useState("");

  const uid = getTokenDataFromCookie()?.uid;

  useEffect(() => {
    fetchTransactions();
  }, [uid, fetchTransactions]);

  const filteredTransactions = transactions.filter((transactionItem) =>
    transactionItem.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col gap-2 w-full p-1">
        <div className="m-2 flex flex-row w-full sm:w-[60%] mx-auto gap-1">
          <TextField.Root
            placeholder="Search for Transaction"
            className="grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <Button>Transfer</Button> */}
          <Add />
        </div>
        {filteredTransactions.map((transactionItem) => (
          <Box key={transactionItem.id} className="mx-auto w-full sm:w-[60%]">
            <Card>
              <Flex gap="3" align="center">
                <Avatar
                  size="3"
                  src="https://assets.techrepublic.com/uploads/2021/08/tux-new.jpg"
                  radius="full"
                  fallback="T"
                />
                <Box>
                  <Text as="div" size="2" weight="bold">
                    <Badge color={transactionItem.isPositive ? "green" : "red"}>
                      ₱{transactionItem.amount.toLocaleString("en-US")}
                    </Badge>
                  </Text>
                  <Text as="div" size="2" color="gray">
                    {transactionItem.description}
                  </Text>
                </Box>

                <div className="flex flex-row items-center gap-1 ml-auto">
                  <Text as="div" size="2" color="gray">
                    {new Date(transactionItem.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      },
                    )}{" "}
                  </Text>

                  <Edit transactionId={transactionItem.id} />
                  <Delete transactionId={transactionItem.id} />
                </div>
              </Flex>
            </Card>
          </Box>
        ))}
      </div>
    </div>
  );
};
