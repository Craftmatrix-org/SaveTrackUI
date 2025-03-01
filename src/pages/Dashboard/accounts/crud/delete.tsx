import { Button, Dialog, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { AtomFetchAccount } from "../../../../atom/AccountAtom";
import { getCookie } from "../../../../api/token";

type EditProps = {
  accountId: string;
};

export const Delete: React.FC<EditProps> = ({ accountId }) => {
  const fetchAccount = useSetAtom(AtomFetchAccount);
  const token = getCookie("token");

  const fetchAccountData = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Account/specific/${accountId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/Account/${accountId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      console.log("Account deleted successfully");
      fetchAccount();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [accountId]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Delete</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Delete Account</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to delete this account?
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={deleteAccount}>Yes</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
