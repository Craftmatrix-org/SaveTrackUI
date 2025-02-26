import { Button, Dialog, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { AtomFetchTransaction } from "../../../../atom/TransactionAtom";

type EditProps = {
  transactionId: string;
};

export const Delete: React.FC<EditProps> = ({ transactionId }) => {
  const fetchTransaction = useSetAtom(AtomFetchTransaction);

  const fetchTransactionData = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Transaction/specific/${transactionId}`,
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  const deleteTransaction = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/Transaction/${transactionId}`,
      );
      console.log("Transaction deleted successfully");
      fetchTransaction();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, [transactionId]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Delete</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Delete Transaction</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to delete this transaction?
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={deleteTransaction}>Yes</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
