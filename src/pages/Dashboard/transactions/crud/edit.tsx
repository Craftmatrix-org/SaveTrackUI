import {
  Button,
  Dialog,
  Flex,
  Text,
  TextField,
  Select,
} from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { getTokenDataFromCookie } from "../../../../api/token";
import axios from "axios";
import { useSetAtom, useAtom } from "jotai";
import { AtomFetchTransaction } from "../../../../atom/TransactionAtom";
import { AtomFetchAccount, AtomAccount } from "../../../../atom/AccountAtom";
import { AtomFetchCategory, AtomCategory } from "../../../../atom/CategoryAtom";

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

export const Edit = ({ transactionId }: { transactionId: string }) => {
  const fetchTransaction = useSetAtom(AtomFetchTransaction);
  const fetchAccount = useSetAtom(AtomFetchAccount);
  const fetchCategory = useSetAtom(AtomFetchCategory);
  const [accounts] = useAtom(AtomAccount);
  const [categories] = useAtom(AtomCategory);

  useEffect(() => {
    fetchAccount();
    fetchCategory();
  }, [fetchAccount, fetchCategory]);

  const uid = getTokenDataFromCookie()?.uid ?? "";
  const [transaction, setTransaction] = useState<TransactionType>({
    id: uid,
    userID: uid,
    description: "",
    amount: 0,
    accountID: "",
    categoryID: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/Transaction/specific/${transactionId}`,
        );
        setTransaction(response.data[0]);
        console.log(response.data[0]);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    fetchTransactionDetails();
  }, [uid]);

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/Transaction/${transactionId}`,
        transaction,
      );
      console.log("Transaction saved:", response.data);
      fetchTransaction();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger onClick={() => fetchTransaction()}>
        <Button>Edit</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Transaction</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Edit the transaction details.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Account ID
            </Text>
            <Select.Root
              value={transaction.accountID}
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
              value={transaction.categoryID}
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
            <TextField.Root
              placeholder="Enter transaction description"
              value={transaction.description}
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
              value={transaction.amount}
              onChange={(e) =>
                setTransaction({
                  ...transaction,
                  amount: parseFloat(e.target.value),
                })
              }
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleSave}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
