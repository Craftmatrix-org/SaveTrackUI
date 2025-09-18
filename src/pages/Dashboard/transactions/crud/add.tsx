import {
  Button,
  Dialog,
  Flex,
  Text,
  TextField,
  Select,
  TextArea,
  Card,
  SegmentedControl,
} from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { getCookie, getTokenDataFromCookie } from "../../../../api/token";
import axios from "axios";
import { useSetAtom, useAtom } from "jotai";
import { AtomFetchTransaction } from "../../../../atom/TransactionAtom";
import { AtomFetchAccount, AtomAccount } from "../../../../atom/AccountAtom";
import { AtomFetchCategory, AtomCategory } from "../../../../atom/CategoryAtom";
import { Deposit } from "./addBundle/deposit";
import { Transfer } from "./addBundle/transfer";
import { Widraw } from "./addBundle/widraw";

export type TransactionType = {
  id: string;
  description: string;
  userID: string;
  amount: number;
  accountID: string;
  categoryID: string;
  createdAt: string;
  updatedAt: string;
};

export const Add = () => {
  const fetchTransaction = useSetAtom(AtomFetchTransaction);
  const fetchAccount = useSetAtom(AtomFetchAccount);
  const fetchCategory = useSetAtom(AtomFetchCategory);
  const [accounts] = useAtom(AtomAccount);
  const [categories] = useAtom(AtomCategory);

  const [transactionType, setTransactionType] = useState("widraw")

  const token = getCookie("token");

  useEffect(() => {
    // console.log(fetchAccount);
    // console.log(fetchCategory);
    fetchAccount();
    fetchCategory();
  }, [fetchAccount, fetchCategory]);

  const uid = getTokenDataFromCookie()?.jti ?? "";
  const [transaction, setTransaction] = useState<TransactionType>({
    id: uid,
    userID: uid,
    description: "",
    amount: 0,
    accountID: accounts[0]?.id ?? "",
    categoryID: categories[0]?.id ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (accounts.length > 0 && !transaction.accountID) {
      setTransaction((prev) => ({
        ...prev,
        accountID: accounts[0].id,
      }));
    }
    if (categories.length > 0 && !transaction.categoryID) {
      setTransaction((prev) => ({
        ...prev,
        categoryID: categories[0].id,
      }));
    }
  }, [accounts, categories]);

  const handleSave = async () => {
    console.log(transaction);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/Transaction`,
        transaction,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      // console.log("Transaction saved:", response.data);
      fetchTransaction();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Add</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Add Transaction</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add a new transaction.
        </Dialog.Description>

        <div className="flex flex-col gap-2">
          <Card>
            <SegmentedControl.Root defaultValue="widraw" onValueChange={setTransactionType}>
              <SegmentedControl.Item value="widraw">Widraw</SegmentedControl.Item>
              <SegmentedControl.Item value="deposit">Deposit</SegmentedControl.Item>
              <SegmentedControl.Item value="transfer">Transfer</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Card>

          <Card>
            {transactionType == "deposit" && (
              <Flex>
                <div>
                  <Deposit />
                </div>
              </Flex>
            )}
            {transactionType == "depositx" && (

              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Account ID
                  </Text>
                  <Select.Root
                    defaultValue={accounts[0]?.id ?? ""}
                    onValueChange={(value) =>
                      setTransaction({ ...transaction, accountID: value })
                    }
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Group>
                        <Select.Label>Accounts</Select.Label>
                        {accounts.map((account) => (
                          <Select.Item key={account.id} value={account.id}>
                            {account.label}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Category ID
                  </Text>
                  <Select.Root
                    defaultValue={categories[0]?.id ?? ""}
                    onValueChange={(value) =>
                      setTransaction({ ...transaction, categoryID: value })
                    }
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Group>
                        <Select.Label>Categories</Select.Label>
                        {categories.map((category) => (
                          <Select.Item key={category.id} value={category.id}>
                            {category.name}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </label>

                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Description
                  </Text>
                  <TextArea
                    placeholder="Enter transaction description"
                    onChange={(e) =>
                      setTransaction({ ...transaction, description: e.target.value })
                    }
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Amount
                  </Text>
                  <TextField.Root
                    placeholder="Enter transaction amount"
                    type="number"
                    onChange={(e) =>
                      setTransaction({
                        ...transaction,
                        amount: parseFloat(e.target.value),
                      })
                    }
                  />
                </label>
              </Flex>
            )}
            {transactionType == "widraw" && (
              <Flex>
                <Widraw />
              </Flex>
            )}
            {transactionType == "transfer" && (
              <Flex>
                <Transfer />
              </Flex>)
            }
          </Card>
        </div>
      </Dialog.Content>
    </Dialog.Root >
  );
};
