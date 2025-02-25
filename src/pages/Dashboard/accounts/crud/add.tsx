import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { getTokenDataFromCookie } from "../../../../api/token";
import axios from "axios";
import { useSetAtom } from "jotai";
import { AtomFetchAccount } from "../../../../atom/AccountAtom";

export const Add = () => {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [initValue, setInitValue] = useState(0);
  const fetchAccount = useSetAtom(AtomFetchAccount);

  const handleSave = async () => {
    const accountData = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      userID: getTokenDataFromCookie()?.uid,
      label,
      description,
      initValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/Account`,
        accountData,
      );
      // console.log(response.data);
      await fetchAccount();
    } catch (error) {
      console.error("Error saving account data:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Add Account</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Add Account</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Manage your financial accounts.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Label
            </Text>
            <TextField.Root
              placeholder="Enter label"
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Initial Value
            </Text>
            <TextField.Root
              type="number"
              placeholder="Enter initial value"
              onChange={(e) => setInitValue(Number(e.target.value))}
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
