import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Add } from "./crud/add";
import { useAtom, useSetAtom } from "jotai";
import { AtomCategory, AtomFetchCategory } from "../../../atom/CategoryAtom";
import { getTokenDataFromCookie } from "../../../api/token";
import { useEffect } from "react";
import { Edit } from "./crud/edit";
import { Delete } from "./crud/delete";

export const Categories = () => {
  const [category] = useAtom(AtomCategory);
  const fetchCategory = useSetAtom(AtomFetchCategory);

  const uid = getTokenDataFromCookie()?.uid;

  useEffect(() => {
    fetchCategory();
  }, [uid]);

  return (
    <div>
      <div className="flex flex-col gap-2 w-full">
        <div className="m-2 flex flex-row w-[60%] mx-auto gap-1">
          <TextField.Root placeholder="Search for Category" className="grow" />
          <Add />
        </div>
        {category.map((categoryItem) => (
          <Box key={categoryItem.id} className="mx-auto w-[60%]">
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
                    {categoryItem.name.toString()} |{" "}
                    <Badge color={categoryItem.isPositive ? "blue" : "red"}>
                      {categoryItem.isPositive ? "deposit" : "withdraw"}
                    </Badge>
                  </Text>
                  <Text as="div" size="2" color="gray">
                    {categoryItem.description}
                  </Text>
                </Box>

                <div className="flex flex-row items-center gap-1 ml-auto">
                  <Text as="div" size="2" color="gray">
                    {new Date(categoryItem.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      },
                    )}{" "}
                  </Text>

                  <Edit categoryId={categoryItem.id} />
                  <Delete categoryId={categoryItem.id} />
                </div>
              </Flex>
            </Card>
          </Box>
        ))}
      </div>
    </div>
  );
};
