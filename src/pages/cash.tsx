import React from "react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { type RouterOutputs, api } from "~/utils/api";
import { useTable } from 'react-table';
import type { Column } from 'react-table';
import Link from "next/link";

type Session = RouterOutputs["session"]["getAllSessions"][0];

const Cash: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: sessions } = api.session.getAllSessions.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  // define columns
  const columns: Column<Session>[] = React.useMemo(
    () => [
    {
      Header: 'Date',
      accessor: 'date', // make sure this is the correct property name from your data
      Cell: ({ value }: { value: Date }) => value.toLocaleDateString(), // format the date here
    },
      {
        Header: "Stakes",
        accessor: "stakes",
      },
      {
        Header: "Buy In",
        accessor: "buyIn",
      },
      {
        Header: "Cash Out",
        accessor: "cashOut",
      },
            {
        Header: "Hourly",
        accessor: "hourly",
        Cell: ({ value }: { value: number }) => `£${value.toFixed(2)}`,
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
          {
      Header: "Profit",
      id: 'profit', // 'id' is needed because we are using a custom accessor
      accessor: (row: Session) => row.cashOut - row.buyIn, // calculate the profit here
      Cell: ({ value }: { value: number }) => `$${value.toFixed(2)}`, // show the profit here
    },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: sessions || [] });

  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-4xl">
      <div className="flex justify-between items-center mt-4">
        <h1 className="font-extrabold text-3xl underline">Cash Sessions</h1>
        <Link href="/" className="link">Go back home</Link>
      </div>
      <div className="w-full max-w-4xl">
        <div className="overflow-x-auto">
      <table {...getTableProps()} className="table table-xs table-pin-rows">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.getCellProps().key}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <div className="flex items-center justify-center mt-4">
        <Link href="/" className="link link-accent">Go back home</Link>
      </div>
      </div>
    </div>
  );
};

export default Cash;
