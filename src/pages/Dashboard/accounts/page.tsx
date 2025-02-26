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
import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { AtomAccount, AtomFetchAccount } from "../../../atom/AccountAtom";
import { getTokenDataFromCookie } from "../../../api/token";
import { Edit } from "./crud/edit";
// import { Search } from "lucide-react";
import { Delete } from "./crud/delete";
export const Account = () => {
  const [account] = useAtom(AtomAccount);
  const fetchAccount = useSetAtom(AtomFetchAccount);

  const uid = getTokenDataFromCookie()?.uid;

  useEffect(() => {
    fetchAccount();
  }, [uid]);

  return (
    <div>
      <div className="flex flex-col gap-2 w-full p-1">
        <div className="m-2 flex flex-row w-full sm:w-[60%] mx-auto gap-1">
          <TextField.Root placeholder="Search for Account" className="grow" />
          <Add />
        </div>
        {account.map((account) => (
          <Box key={account.id} className="mx-auto w-full sm:w-[60%]">
            <Card>
              <Flex gap="3" align="center">
                <Avatar
                  size="3"
                  src="https://assets.techrepublic.com/uploads/2021/08/tux-new.jpg"
                  // src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                  radius="full"
                  fallback="T"
                />
                <Box>
                  <Text as="div" size="2" weight="bold">
                    {account.label}
                  </Text>
                  <Text as="div" size="2" color="gray">
                    {account.description}
                  </Text>
                  <Badge color={account.total < 0 ? "red" : "blue"}>
                    ₱ {account.total.toLocaleString()}
                  </Badge>
                </Box>

                <div className="flex flex-row items-center gap-1 ml-auto">
                  <Text as="div" size="2" color="gray">
                    {new Date(account.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}{" "}
                  </Text>

                  <Edit accountId={account.id} />
                  <Delete accountId={account.id} />
                </div>
              </Flex>
            </Card>
          </Box>
        ))}
      </div>
    </div>
  );
};
