import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import dayjs from "dayjs";

export const AddCashForm: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: sessions } = api.session.getAllSessions.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const sessionsAvailable = sessions && sessions?.length > 0;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {sessionsAvailable && (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Date</th>
                <th>Stakes</th>
                <th>Buy In</th>
                <th>Cash Out</th>
                <th>P/L</th>
                <th>Duration</th>
                <th>Hourly</th>
              </tr>
            </thead>
            <tbody>
              {sessions?.map((session) => (
                <tr key={session.id} className="hover">
                  <td>{dayjs(session.date).format("DD/MM/YYYY")}</td>
                  <td>{session.stakes}</td>
                  <td>{`£${session.buyIn}`}</td>
                  <td>{`£${session.cashOut}`}</td>
                  <td>{`£${session.profit}`}</td>
                  <td>{`${session.duration} hours`}</td>
                  <td>{`£${session.hourly} p/h`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
