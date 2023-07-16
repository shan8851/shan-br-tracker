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
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center justify-center">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="btn btn-primary drawer-button "
          >
            Add new session
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <form className="h-full menu w-80 bg-base-200 p-4 text-base-content">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Stakes</span>
              </label>
              <select className="select select-bordered">
                <option disabled selected>
                  Pick one
                </option>
                <option>1/2</option>
                <option>1/3</option>
                <option>2/5</option>
                <option>5/10</option>
                <option>10/25</option>
              </select>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Buy in</span>
              </label>
              <input
                type="number"
                placeholder="500"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Cash out</span>
              </label>
              <input
                type="number"
                placeholder="1500"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Duration (mins)</span>
              </label>
              <input
                type="number"
                placeholder="360"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <button className="btn btn-primary">Add Session</button>
          </form>
        </div>
      </div>
      <div>
        {sessions?.map((session) => (
          <div key={session.id}>{JSON.stringify(session)}</div>
        ))}
      </div>
    </div>
  );
};
