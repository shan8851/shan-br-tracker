import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

export const Stats = () => {
  const { data: sessionData } = useSession();

  const { data: bankroll } = api.bankroll.getCurrentBankroll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  return (
    <div className="stats stats-vertical shadow lg:stats-horizontal">
      <div className="stat">
        <div className="stat-title">Bankroll</div>
        <div className="stat-value">£{bankroll}</div>
        <div className="stat-desc">Jan 1st - Feb 1st</div>
      </div>

      <div className="stat">
        <div className="stat-title">Cash Sessions</div>
        <div className="stat-value">4,200</div>
        <div className="stat-desc">↗︎ 400 (22%)</div>
      </div>

      <div className="stat">
        <div className="stat-title">Tournaments</div>
        <div className="stat-value">1,200</div>
        <div className="stat-desc">↘︎ 90 (14%)</div>
      </div>
    </div>
  );
};
