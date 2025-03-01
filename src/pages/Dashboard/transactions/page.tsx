import {
  Avatar,
  Badge,
  Box,
  // Button,
  Card,
  Flex,
  ScrollArea,
  Switch,
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
import { AtomEmail } from "../../../atom/GateAtom";
import axios from "axios";

export const Transaction = () => {
  const [email] = useAtom(AtomEmail);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/UserToken/${email}`,
          {
            timeout: 5000,
          },
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

  const [transactions] = useAtom(AtomTransaction);
  const fetchTransactions = useSetAtom(AtomFetchTransaction);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );
  const [showAll, setShowAll] = useState(false);

  const uid = getTokenDataFromCookie()?.uid;

  useEffect(() => {
    fetchTransactions();
  }, [uid, fetchTransactions]);

  const filteredTransactions = transactions
    .filter((transactionItem) =>
      transactionItem.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
    .filter((transactionItem) => {
      if (showAll) return true;
      const transactionDate = new Date(
        transactionItem.createdAt,
      ).toLocaleDateString("en-CA");
      return transactionDate === selectedDate;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const totalExpenses = filteredTransactions
    .filter((transactionItem) => !transactionItem.isPositive)
    .reduce((acc, transactionItem) => acc + transactionItem.amount, 0);

  const totalEarned = filteredTransactions
    .filter((transactionItem) => transactionItem.isPositive)
    .reduce((acc, transactionItem) => acc + transactionItem.amount, 0);

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
          <Add />
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-[60%] mx-auto gap-1">
          <Card className="flex-1 text-center">
            Expenses:
            <Badge color="red">₱{totalExpenses.toLocaleString("en-US")}</Badge>
          </Card>
          <Card className="flex-1 text-center">
            Earned:
            <Badge color="green">₱{totalEarned.toLocaleString("en-US")}</Badge>
          </Card>
        </div>
        <div className=" flex flex-col w-full sm:w-[60%] mx-auto gap-1">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={showAll}
            className="w-fit"
          />
          <div className="mr-1 ml-auto">
            Show all{" "}
            <Switch defaultChecked={showAll} onCheckedChange={setShowAll} />
          </div>
        </div>

        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{
            height: "calc(100vh - 300px)",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="scroll-area sm:max-w-full"
        >
          <div className="flex flex-col gap-1">
            {filteredTransactions.length === 0 ? (
              <Text as="div" size="2" color="gray" className="text-center">
                No transactions yet.
              </Text>
            ) : (
              filteredTransactions.map((transactionItem) => (
                <Box key={transactionItem.id} className="mx-auto w-full">
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
                          <Badge
                            color={transactionItem.isPositive ? "green" : "red"}
                          >
                            ₱{transactionItem.amount.toLocaleString("en-US")}
                          </Badge>
                          <Text as="div" size="2" color="gray">
                            {transactionItem.concat}
                          </Text>
                        </Text>
                        <Text as="div" size="2" color="gray">
                          {transactionItem.description}
                        </Text>
                      </Box>

                      <div className="flex flex-col items-center gap-2 ml-auto">
                        <Text
                          as="div"
                          size="2"
                          color="gray"
                          className="whitespace-nowrap"
                        >
                          {new Date(transactionItem.createdAt).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </Text>
                        <Flex gap="2">
                          <Edit transactionId={transactionItem.id} />
                          <Delete transactionId={transactionItem.id} />
                        </Flex>
                      </div>
                    </Flex>
                  </Card>
                </Box>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
