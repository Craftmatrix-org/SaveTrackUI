import {
  Button,
  Dialog,
  Flex,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { getCookie, getTokenDataFromCookie } from "../../../../api/token";
import axios from "axios";
import { useSetAtom } from "jotai";
import { AtomFetchCategory } from "../../../../atom/CategoryAtom";

type EditProps = {
  categoryId: string;
};

export const Edit: React.FC<EditProps> = ({ categoryId }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPositive, setIsPositive] = useState<boolean>(false);
  const fetchCategory = useSetAtom(AtomFetchCategory);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Category/specific/${categoryId}`,
        {
          headers: {
            Authorization: `${getCookie("token")}`,
          },
        },
      );

      setName(response.data[0].name || "");
      setDescription(response.data[0].description || "");
      setIsPositive(response.data[0].isPositive || false);
      fetchCategory();
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [categoryId]);

  const handleSave = async () => {
    const categoryData = {
      id: categoryId,
      userID: getTokenDataFromCookie()?.jti,
      name,
      description,
      isPositive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/Category/${categoryId}`,
        categoryData,
        {
          headers: {
            Authorization: `${getCookie("token")}`,
          },
        },
      );
      console.log(categoryData);
      await fetchCategory();
    } catch (error) {
      console.error("Error saving category data:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Edit</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Category</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Edit the category details.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              placeholder="Enter category name"
              defaultValue={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              placeholder="Enter category description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Is Positive?
            </Text>
            <Switch
              checked={isPositive}
              onCheckedChange={(checked) => setIsPositive(checked)}
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
