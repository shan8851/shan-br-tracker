import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { type RouterOutputs, api } from "~/utils/api";

type BankrollEntry = RouterOutputs["bankroll"]["getAllBankrollEntries"][0];

export const BankrollOverTime: React.FC = () => {
  const { data: sessionData } = useSession();
  const [accentColor, setAccentColor] = useState("#8884d8");
  const [strokeColor, setStrokeColor] = useState("#ccc");

  useEffect(() => {
    const accentColorHelper = document.getElementById('accentColorHelper');
    const strokeColorHelper = document.getElementById('strokeColorHelper');
    if (accentColorHelper) {
      setAccentColor(window.getComputedStyle(accentColorHelper).backgroundColor);
    }
    if (strokeColorHelper) {
      setStrokeColor(window.getComputedStyle(strokeColorHelper).backgroundColor);
    }
  }, []);

  const { data: bank } = api.bankroll.getAllBankrollEntries.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const formattedBank = bank?.map((entry: BankrollEntry) => {
    const date = new Date(entry.createdAt).toLocaleDateString();
    const type = entry.deposit !== 0 ? "deposit" : "withdrawal";
    const amount = entry.deposit !== 0 ? entry.deposit : entry.withdrawal;

    return { id: entry.id, date, type, amount };
  });

  return (
    <>
      <div id="accentColorHelper" className="hidden bg-accent" />
      <div id="strokeColorHelper" className="hidden bg-neutral" />
      <LineChart width={600} height={300} data={formattedBank}>
        <Line type="monotone" strokeWidth={3} dataKey="amount" stroke={accentColor} />
        <CartesianGrid stroke={strokeColor} strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </>
  );
};
