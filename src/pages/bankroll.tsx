import React from 'react'
import type { NextPage } from 'next'
import { useSession } from "next-auth/react";
import { type RouterOutputs, api } from "~/utils/api";

type BankrollEntry = RouterOutputs["bankroll"]["getAllBankrollEntries"][0];

type FormattedBankEntry = {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
};


const Bankroll: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: bank } = api.bankroll.getAllBankrollEntries.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const formattedBank = bank?.map((entry: BankrollEntry) => {
  const date = new Date(entry.createdAt).toLocaleDateString();
  const type = entry.deposit !== 0 ? 'deposit' : 'withdrawal';
  const amount = entry.deposit !== 0 ? entry.deposit : entry.withdrawal;

  return { id: entry.id, date, type, amount };
});


  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto py-5 items-center">
      <h1 className="font-extrabold text-3xl underline">Bankroll History</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
             {
          formattedBank?.map((entry: FormattedBankEntry) => (
        <tr key={entry.id}>
          <td>{entry.date}</td>
          <td>{entry.type}</td>
          <td>{`£${Math.abs(entry.amount)}`}</td>
        </tr>
      ))
        }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Bankroll
