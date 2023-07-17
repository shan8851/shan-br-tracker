import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

export const Withdrawal: React.FC = () => {
  const [withdrawal, setWithdrawal] = useState<number>(0);

  const { data: sessionData } = useSession();

  const { refetch: refetchBankroll } = api.bankroll.getCurrentBankroll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const addWithdrawal = api.bankroll.addWithdrawal.useMutation({
    onSuccess: () => {
      setWithdrawal(0);
      void refetchBankroll();
    },
  });

  return (
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
  );
};
