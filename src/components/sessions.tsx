import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

// interface Session {
//   date: Date;
//   stakes: number;
//   buyIn: number;
//   cashOut: number;
//   duration: number;
// }

export const Sessions: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: sessions, refetch: refetchSessions } =
    api.session.getAllSessions.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
    });

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-3xl font-extrabold">Sessions</h1>
      <div>
        {sessions?.map((session) => (
          <div key={session.id}>{JSON.stringify(session)}</div>
        ))}
      </div>
    </div>
  );
};
