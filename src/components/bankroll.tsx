import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import { Deposit } from "./deposit";
import { Withdrawal } from "./withdrawal";

export const Bankroll: React.FC = () => {
  const [showDeposit, setShowDeposit] = React.useState<boolean>(false);
  const [showWithdraw, setShowWithdraw] = React.useState<boolean>(false);
  const { data: sessionData } = useSession();

  const { data: bankroll } = api.bankroll.getCurrentBankroll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const formattedBankroll =
    bankroll &&
    bankroll.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold">BANKROLL</h1>
      <h1 className="text-6xl font-extrabold">{
        formattedBankroll ?? 0
      }</h1>
      <div className="flex w-full justify-center gap-4">
        <div
          onClick={() => setShowDeposit(true)}
          className="badge badge-secondary cursor-pointer"
        >
          DEPOSIT +
        </div>
        <div
          onClick={() => setShowWithdraw(true)}
          className="badge badge-secondary cursor-pointer"
        >
          WITHDRAW -
        </div>
      </div>
      {showDeposit && (
        <Deposit onClose={() => setShowDeposit(false)} />
      )}
      {showWithdraw && (
        <Withdrawal onClose={() => setShowWithdraw(false)} />
      )}
    </div>
  );
};
