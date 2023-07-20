import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import { AddCashForm } from "./addCashForm";

export const Cash: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: sessions } = api.session.getTotals.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  let profitSymbol = "";

  if (sessions?.totalProfit !== undefined) {
    profitSymbol =
      sessions.totalProfit > 0 ? "+" : sessions.totalProfit < 0 ? "-" : "";
  }

  const currentDate = dayjs().format("DD/MM/YYYY");

  const startOfYear = dayjs().startOf("year").format("DD/MM/YYYY");

  const fallbackFirstSessionDate = startOfYear;
  const fallbackLastSessionDate = currentDate;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-3xl font-extrabold">Cash Games</h1>
      <div className="stats  stats-vertical w-full bg-primary shadow lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Sessions</div>
          <div className="stat-value">{sessions?.totalSessions ?? 0}</div>
          <div className="stat-desc">
            {sessions?.firstSessionDate
              ? new Date(sessions.firstSessionDate).toLocaleDateString()
              : fallbackFirstSessionDate}
            -
            {sessions?.lastSessionDate
              ? new Date(sessions.lastSessionDate).toLocaleDateString()
              : fallbackLastSessionDate}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Winning Sessions</div>
          <div className="stat-value">{sessions?.winningSessions ?? 0}</div>
          <div className="stat-desc">
            {`${sessions?.winningSessionPercent ?? 0}%`}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Losing Sessions</div>
          <div className="stat-value">{sessions?.losingSessions ?? 0}</div>
          <div className="stat-desc">
            {`${sessions?.losingSessionPercent ?? 0}%`}
          </div>
        </div>
      </div>
      <div className="stats stats-vertical w-full shadow lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Hourly</div>
          <div className="stat-value">
            {(sessions?.totalHourly ?? 0).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Profit/Loss</div>
          <div className="stat-value">
            <div className="flex items-center gap-2">
            <p>{profitSymbol}</p>
              <p>
                {(sessions?.totalProfit ?? 0).toLocaleString("en-GB", {
                  style: "currency",
                  currency: "GBP",
                })}
              </p>

            </div>
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">No. Of Hours</div>
          <div className="stat-value">{sessions?.totalHours ?? 0}</div>
        </div>
      </div>
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex items-center justify-center">
            <label
              htmlFor="my-drawer-4"
              className="btn btn-neutral btn-block drawer-button"
            >
              Add new session
            </label>
          </div>
          <AddCashForm />
        </div>
    </div>
  );
};
