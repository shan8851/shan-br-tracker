import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

export const Bankroll: React.FC = () => {
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
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-3xl font-extrabold">{`Bankroll: £${bankroll ?? ""}`}</h1>
      <div className="flex gap-4 items-center">
        <div className="form-control w-full max-w-xs">
          <input
            type="text"
            placeholder="Deposit amount"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setDeposit(Number(e.target.value))}
          />
        </div>
        <button
          onClick={() => addDeposit.mutate({ amount: deposit })}
          className="btn"
        >
          DEPOSIT
        </button>
      </div>
      <div className="flex gap-4 items-center">
        <div className="form-control w-full max-w-xs">
          <input
            type="text"
            placeholder="Withdrawal amount"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setWithdrawal(Number(e.target.value))}
          />
        </div>
        <button
          onClick={() => addWithdrawal.mutate({ amount: withdrawal })}
          className="btn"
        >
          WITHDRAW
        </button>
      </div>
    </div>
  );
};
