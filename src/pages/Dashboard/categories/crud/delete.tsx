import { Button, Dialog, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { AtomFetchCategory } from "../../../../atom/CategoryAtom";
import { getCookie } from "../../../../api/token";

type EditProps = {
  categoryId: string;
};

export const Delete: React.FC<EditProps> = ({ categoryId }) => {
  const fetchCategory = useSetAtom(AtomFetchCategory);
  const fetchCategoryData = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/Category/specific/${categoryId}`,
        {
          headers: {
            Authorization: `${getCookie("token")}`,
          },
        },
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const deleteCategory = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/Category/${categoryId}`,
        {
          headers: {
            Authorization: `${getCookie("token")}`,
          },
        },
      );
      console.log("Category deleted successfully");
      fetchCategory();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [categoryId]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Delete</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Delete Category</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to delete this category?
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={deleteCategory}>Yes</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
