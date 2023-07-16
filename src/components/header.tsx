import { signIn, signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-3xl font-bold ">
        {sessionData?.user?.name}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          {sessionData?.user ? (
            <label
              tabIndex={0}
              className="btn-circle btn-ghost avatar btn"
              onClick={() => void signOut()}
            >
              <div className="w-10 rounded-full">
                <img
                  src={sessionData?.user?.image ?? ""}
                  alt={sessionData?.user?.name ?? ""}
                  />
              </div>
            </label>
          ): (
            <button
              className="btn rounded-btn btn-ghost"
              onClick={() => void signIn()}
              >
                Sign In
              </button>
          )}
        </div>
      </div>
    </div>
  )
}
