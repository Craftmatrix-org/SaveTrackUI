import {
  // Avatar,
  Badge,
  Box,
  // Button,
  Card,
  Flex,
  ScrollArea,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Add } from "./crud/add";
import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { AtomAccount, AtomFetchAccount } from "../../../atom/AccountAtom";
import { getTokenDataFromCookie } from "../../../api/token";
import { Edit } from "./crud/edit";
import { Delete } from "./crud/delete";
export const Account = () => {
  const [account] = useAtom(AtomAccount);
  const fetchAccount = useSetAtom(AtomFetchAccount);
  const [searchTerm, setSearchTerm] = useState("");

  const uid = getTokenDataFromCookie()?.jti;

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount, uid]);

  const filteredAccounts = account.filter((acc) =>
    acc.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col gap-2 w-full p-1">
        <div className="m-2 flex flex-col w-full sm:w-[60%] mx-auto gap-2">
          <Card className="flex flex-col w-full">
            <div className="gap-1 justify-center flex flex-col items-center">
              <Text className="flex flex-col items-center justify-center">
                <span>Total:</span>
                <Badge color="blue">
                  ₱{" "}
                  {account
                    .reduce((sum, acc) => sum + acc.total, 0)
                    .toLocaleString()}
                </Badge>
              </Text>
            </div>
          </Card>
          <div className="flex flex-row w-full gap-1">
            <Card className="flex flex-col w-full">
              <div className="gap-1 justify-center flex flex-col items-center">
                <Text className="flex flex-col items-center justify-center">
                  <span>Debit:</span>
                  <Badge color="green">
                    ₱{" "}
                    {account
                      .filter((acc) => acc.total > 0)
                      .reduce((sum, acc) => sum + acc.total, 0)
                      .toLocaleString()}
                  </Badge>
                </Text>
              </div>
            </Card>
            <Card className="flex flex-col w-full">
              <div className="gap-1 justify-center flex flex-col items-center">
                <Text className="flex flex-col items-center justify-center">
                  <span>Credit:</span>
                  <Badge color="red">
                    ₱{" "}
                    {account
                      .filter((acc) => acc.total < 0)
                      .reduce((sum, acc) => sum + acc.total, 0)
                      .toLocaleString()}
                  </Badge>
                </Text>
              </div>
            </Card>
          </div>
        </div>
        <div className="m-2 flex flex-row w-full sm:w-[60%] mx-auto gap-1">
          <TextField.Root
            placeholder="Search for Account"
            className="grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Add />
        </div>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{
            height: "calc(100vh - 300px)",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="scroll-area sm:max-w-full"
        >
          <div className="flex flex-col gap-1">
            {filteredAccounts.length === 0 ? (
              <Text className="text-center">No account yet</Text>
            ) : (
              filteredAccounts.map((account) => (
                <Box key={account.id} className="mx-auto w-full ">
                  <Card>
                    <Flex gap="3" align="center">
                      {/* <Avatar
                        size="3"
                        src="https://assets.techrepublic.com/uploads/2021/08/tux-new.jpg"
                        radius="full"
                        fallback="T"
                      /> */}
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          {account.label}
                        </Text>
                        <Text as="div" size="2" color="gray">
                          {account.description}
                        </Text>
                        <Badge
                          color={
                            account.total === 0
                              ? "gray"
                              : account.total < 0
                                ? "red"
                                : "blue"
                          }
                        >
                          ₱ {account.total.toLocaleString()}
                        </Badge>
                      </Box>

                      <div className="flex flex-row items-center gap-1 ml-auto">
                        <Text as="div" size="2" color="gray">
                          {new Date(account.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )}{" "}
                        </Text>
                        {/* <Button>View Data</Button> */}
                        <Edit accountId={account.id} />
                        <Delete accountId={account.id} />
                      </div>
                    </Flex>
                  </Card>
                </Box>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
