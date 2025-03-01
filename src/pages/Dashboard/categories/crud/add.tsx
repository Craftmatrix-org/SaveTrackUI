import {
  Button,
  Dialog,
  Flex,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { getCookie, getTokenDataFromCookie } from "../../../../api/token";
import axios from "axios";
import { useSetAtom } from "jotai";
import { AtomFetchCategory } from "../../../../atom/CategoryAtom";

export type CategoryType = {
  id: string;
  userID: string;
  name: string;
  description: string;
  isPositive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const Add = () => {
  const fetchCategory = useSetAtom(AtomFetchCategory);

  const token = getCookie("token");

  const uid = getTokenDataFromCookie()?.jti ?? "";
  const [category, setCategory] = useState<CategoryType>({
    id: uid,
    userID: uid,
    name: "",
    description: "",
    isPositive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/Category`,
        category,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      console.log("Category saved:", response.data);
      fetchCategory();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Add</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Add Category</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add a new category.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              placeholder="Enter category name"
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              placeholder="Enter category description"
              onChange={(e) =>
                setCategory({ ...category, description: e.target.value })
              }
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Is Positive?
            </Text>
            <Switch
              defaultChecked
              onCheckedChange={(checked) =>
                setCategory({ ...category, isPositive: checked })
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
