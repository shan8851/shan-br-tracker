import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

export const Bankroll: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: bankroll } = api.bankroll.getCurrentBankroll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const formattedBankroll = bankroll && bankroll.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-3xl font-extrabold">BANKROLL</h1>
        <h1 className="text-6xl font-extrabold">{formattedBankroll ?? 0}</h1>
    </div>
  );
};
