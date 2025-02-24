import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { getTokenDataFromCookie } from "../../../../api/token";
import axios from "axios";
import { useSetAtom } from "jotai";
import { AtomFetchAccount } from "../../../../atom/AccountAtom";

type EditProps = {
  accountId: string;
};

export const Edit: React.FC<EditProps> = ({ accountId }) => {
  const [label, setLabel] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [initValue, setInitValue] = useState<number>(0);
  const fetchAccount = useSetAtom(AtomFetchAccount);

  const fetchAccountData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Account/specific/${accountId}`,
      );

      setLabel(response.data[0].label || "");
      setDescription(response.data[0].description || "");
      setInitValue(response.data[0].initValue || 0);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [accountId]);

  const handleSave = async () => {
    const accountData = {
      id: accountId,
      userID: getTokenDataFromCookie()?.uid,
      label,
      description,
      initValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/Account/${accountId}`,
        accountData,
      );
      console.log(accountData);
      await fetchAccount();
    } catch (error) {
      console.error("Error saving account data:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Edit Account</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Account</Dialog.Title>
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
              defaultValue={label}
              onChange={(e) => setLabel(e.currentTarget.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Initial Value
            </Text>
            <TextField.Root
              type="number"
              placeholder="Enter initial value"
              value={initValue}
              onChange={(e) => setInitValue(Number(e.currentTarget.value))}
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
