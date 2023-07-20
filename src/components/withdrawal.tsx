import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

interface Props {
  onClose: () => void;
}

export const Withdrawal: React.FC<Props> = ({ onClose }) => {
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
      onClose()
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
              <button
        onClick={onClose}
        className="btn btn-square">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      </div>
  );
};
