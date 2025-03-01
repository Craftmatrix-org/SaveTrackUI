import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  ScrollArea,
  SegmentedControl,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Add } from "./crud/add";
import { useAtom, useSetAtom } from "jotai";
import { AtomCategory, AtomFetchCategory } from "../../../atom/CategoryAtom";
import { getTokenDataFromCookie } from "../../../api/token";
import { useEffect, useState } from "react";
import { Edit } from "./crud/edit";
import { Delete } from "./crud/delete";

export const Categories = () => {
  const [category] = useAtom(AtomCategory);
  const fetchCategory = useSetAtom(AtomFetchCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const uid = getTokenDataFromCookie()?.jti;

  useEffect(() => {
    fetchCategory();
  }, [uid, fetchCategory]);

  const filteredCategories = category.filter((categoryItem) => {
    const matchesSearchTerm = categoryItem.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filter === "all") return matchesSearchTerm;
    if (filter === "deposit")
      return matchesSearchTerm && categoryItem.isPositive;
    if (filter === "withdraw")
      return matchesSearchTerm && !categoryItem.isPositive;
    return false;
  });

  return (
    <div className="flex flex-col gap-2 w-full p-1">
      <div className="m-2 flex flex-row w-full sm:w-[60%] mx-auto gap-1">
        <TextField.Root
          placeholder="Search for Category"
          className="flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Add />
      </div>
      <div className="m-2 flex flex-row w-full sm:w-[60%] mx-auto gap-1">
        <SegmentedControl.Root defaultValue="all" onValueChange={setFilter}>
          <SegmentedControl.Item value="all">All</SegmentedControl.Item>
          <SegmentedControl.Item value="deposit">Deposit</SegmentedControl.Item>
          <SegmentedControl.Item value="withdraw">
            Withdraw
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>

      <ScrollArea
        type="always"
        scrollbars="vertical"
        style={{
          height: "calc(100vh - 190px)",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        className="scroll-area sm:max-w-full"
      >
        <div className="flex flex-col gap-1">
          {filteredCategories.length === 0 ? (
            <Text as="div" size="2" color="gray" className="text-center">
              No categories yet.
            </Text>
          ) : (
            filteredCategories.map((categoryItem) => (
              <Card key={categoryItem.id} className="mb-2 w-full">
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
                  <div className="flex flex-row items-center gap-2 ml-auto">
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
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
