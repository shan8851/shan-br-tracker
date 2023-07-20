import React from "react";
import Head from "next/head";
import { Header } from "~/components/header";
import { Bankroll } from "~/components/bankroll";
import { Cash } from "~/components/cash";
import { Tournaments } from "~/components/tournaments";
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
              <Header />
              <Bankroll />
              <Cash />
              <Tournaments />
            </>
          )}
          {!isLoggedIn && (
            <div className="flex flex-col min-h-screen min-w-screen items-center justify-center gap-5">
              <h1 className="text-3xl font-extrabold">
                Welcome to Shan BR Tracker
              </h1>
              <p className="text-xl">Please sign in to view your stats</p>
                          <button
              className="btn btn-wide btn-lg btn-accent"
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
