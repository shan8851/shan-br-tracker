import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

export const Deposit: React.FC = () => {
  const [deposit, setDeposit] = useState<number>(0);

  const { data: sessionData } = useSession();

  const { refetch: refetchBankroll } = api.bankroll.getCurrentBankroll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const addDeposit = api.bankroll.addDeposit.useMutation({
    onSuccess: () => {
      setDeposit(0);
      void refetchBankroll();
    },
  });
  return (
    <div className="flex items-center gap-4">
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
  );
};
