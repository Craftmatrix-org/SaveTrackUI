import { Button, Table } from "@radix-ui/themes";
import { Add } from "./crud/add";
import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { AtomAccount, AtomFetchAccount } from "../../../atom/AccountAtom";
import { getTokenDataFromCookie } from "../../../api/token";
import { Edit } from "./crud/edit";

export const Account = () => {
  const [account] = useAtom(AtomAccount);
  const fetchAccount = useSetAtom(AtomFetchAccount);

  const uid = getTokenDataFromCookie()?.uid;

  const fetchData = async () => {
    if (uid) {
      await fetchAccount();
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchAccount]);

  return (
    <div>
      <div className="m-2">
        <Add />
      </div>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Label</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {account.map((account) => (
            <Table.Row key={account.id}>
              <Table.RowHeaderCell>{account.label}</Table.RowHeaderCell>
              <Table.Cell>{account.description}</Table.Cell>
              <Table.Cell>{account.initValue}</Table.Cell>
              <Table.Cell className="flex gap-1">
                {/* <Button className="m-1">Edit</Button> */}
                <Edit accountId={account.id} />
                <Button className="m-1">Delete</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
