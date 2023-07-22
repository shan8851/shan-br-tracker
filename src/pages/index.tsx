import React from "react";
import Head from "next/head";
import { Header } from "~/components/header";
import { Bankroll } from "~/components/bankroll";
import { CashStats } from "~/components/cashStats";
import { TournamentStats } from "~/components/tournamentStats";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { data: sessionData } = useSession();
  const isLoggedIn = sessionData?.user;

  return (
    <>
      <Head>
        <title>Shan BR Tracker</title>
        <meta name="description" content="bankroll tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <>
          {isLoggedIn && (
            <>
              <Bankroll />
              <CashStats />
              <TournamentStats />
            </>
          )}
          {!isLoggedIn && (
              <div className="min-w-screen flex h-full flex-col items-center justify-center gap-5 mt-8">
                <h1 className="text-3xl font-extrabold">
                  Welcome to Shan BR Tracker
                </h1>
                <p className="text-xl">Please sign in to view your stats</p>
                <button
                  className="btn btn-accent btn-lg btn-wide"
                  onClick={() => void signIn()}
                >
                  Sign In
                </button>
              </div>
          )}
        </>
      </main>
    </>
  );
}
