import { signIn, signOut, useSession } from "next-auth/react";
import ThemeSelector from "./themeSelector";
import Link from "next/link";

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="navbar bg-base-300 text-primary-content">
      <div className="hidden md:flex flex-1">
        <Link href="/" className="btn btn-ghost text-xl normal-case">
          bankrollTRACKER
        </Link>
      </div>
      <div className="flex justify-between w-full md:justify-end">
        <Link className="btn btn-ghost rounded-btn" href="/bankroll">
          Bankroll
        </Link>
        <Link className="btn btn-ghost rounded-btn" href="/cash">
          Cash
        </Link>
        <Link className="btn btn-ghost rounded-btn" href="/tournaments">
          MTTs
        </Link>
        <div className="dropdown dropdown-end">
          {sessionData?.user ? (
            <button
              className="btn btn-ghost rounded-btn"
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
          ) : (
            <button
              className="btn btn-ghost rounded-btn"
              onClick={() => void signIn()}
            >
              Sign In
            </button>
          )}
        </div>
        <ThemeSelector />
      </div>
    </div>
  );
};
