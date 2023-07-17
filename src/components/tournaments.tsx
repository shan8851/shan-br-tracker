import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

export const Tournaments: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: tournaments } = api.tournament.getTotals.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold">Tournaments</h1>
      <div className="stats stats-vertical bg-accent shadow lg:stats-horizontal w-full">
        <div className="stat">
          <div className="stat-title">Total Tournaments</div>
          <div className="stat-value">{tournaments?.totalTournaments ?? 0}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Profit/Loss</div>
          <div className="stat-value">
            {(tournaments?.profitLoss ?? 0).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Average Buy In</div>
          <div className="stat-value">            {(tournaments?.averageBuyIn ?? 0).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}</div>
        </div>
      </div>
            <div className="stats stats-vertical shadow lg:stats-horizontal w-full">
        <div className="stat">
          <div className="stat-title">Total Buy Ins</div>
          <div className="stat-value">{(tournaments?.totalBuyIns ?? 0).toLocaleString('en-GB', { style: "currency", currency: "GBP"})}</div>
        </div>

        <div className="stat">
          <div className="stat-title">In The Money</div>
          <div className="stat-value">
            {tournaments?.itmPercentage ?? '0%'}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Return On Investment</div>
          <div className="stat-value">{tournaments?.roi ?? '0%'}</div>
        </div>
      </div>
    </div>
  );
};
