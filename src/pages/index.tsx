import React from 'react'
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Header } from "~/components/header";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>Shan BR Tracker</title>
        <meta name="description" content="bankroll tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Bankroll />
      </main>
    </>
  );
}

const Bankroll: React.FC = () => {
  const [deposit, setDeposit] = React.useState<number>(0);
  const [withdrawal, setWithdrawal] = React.useState<number>(0);
  const { data: sessionData } = useSession();

  const { data: bankroll, refetch: refetchBankroll } =
    api.bankroll.getCurrentBankroll.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
    });

  const addDeposit = api.bankroll.addDeposit.useMutation({
    onSuccess: () => {
      setDeposit(0);
      void refetchBankroll();
    },
  });

  const addWithdrawal = api.bankroll.addWithdrawal.useMutation({
    onSuccess: () => {
      setWithdrawal(0);
      void refetchBankroll();
    },
  });
  return (
    <div>
      <h1>{`Bankroll: ${bankroll ?? ""}`}</h1>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Deposit amount</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          onChange={e => setDeposit(Number(e.target.value))}
        />
      </div>
      <button onClick={() => addDeposit.mutate({ amount: deposit})} className="btn">DEPOSIT</button>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Withdrawal amount</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          onChange={e => setWithdrawal(Number(e.target.value))}
        />
      </div>
      <button onClick={() => addWithdrawal.mutate({ amount: withdrawal})} className="btn">WITHDRAW</button>
    </div>
  );
};
