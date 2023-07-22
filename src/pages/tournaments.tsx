import React from "react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useTable } from 'react-table';
import type { Column } from 'react-table';
import Link from "next/link";
import { calculateROI } from "~/helpers/getRoi";

type Tourney = {
  id: string;
  date: Date;
  buyIn: number;
  numEntrants: number;
  placeFinished: number;
  cashAmount: number;
  roi: number;
};

const Tournaments: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: tournaments } = api.tournament.getAllTournaments.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const columns: Column<Tourney>[] = React.useMemo(
    () => [
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({ value }: { value: Date }) => value.toLocaleDateString(),
    },
      {
        Header: "Buy In",
        accessor: "buyIn",
      },
      {
        Header: "Entrants",
        accessor: "numEntrants",
      },
      {
        Header: "Finish",
        accessor: "placeFinished",
      },
      {
        Header: "Cash Amount",
        accessor: "cashAmount",
      },
          {
      Header: "ROI",
      id: 'roi',
      accessor: (row: Tourney) => calculateROI(row.buyIn, row.cashAmount),
      Cell: ({ value }: { value: number }) => `${value}%`,
    },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tournaments || [] });

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

export default Tournaments;
