import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import { AddTournamentForm } from "./addTournamentForm";
import Link from "next/link";

export const TournamentStats: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: tournaments } = api.tournament.getTotals.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-3xl font-extrabold">Tournaments</h1>
      <div className="stats stats-vertical w-full bg-accent shadow lg:stats-horizontal">
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
          <div className="stat-value">
            {" "}
            {(tournaments?.averageBuyIn ?? 0).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}
          </div>
        </div>
      </div>
      <div className="stats stats-vertical w-full shadow lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total Buy Ins</div>
          <div className="stat-value">
            {(tournaments?.totalBuyIns ?? 0).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">In The Money</div>
          <div className="stat-value">{tournaments?.itmPercentage ?? "0%"}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Return On Investment</div>
          <div className="stat-value">{`${tournaments?.roi ?? 0}%`}</div>
        </div>
      </div>
      <div className="drawer drawer-end">
        <input
          id="add_tournament_session"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex items-center justify-center">
          <label
            htmlFor="add_tournament_session"
            className="btn btn-neutral drawer-button btn-block"
          >
            Add tournament
          </label>
        </div>
        <AddTournamentForm />
      </div>
      <Link href="/tournaments" className="btn btn-secondary btn-block">View all tournaments</Link>
    </div>
  );
};
