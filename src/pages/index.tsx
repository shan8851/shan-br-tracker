import React from "react";
import Head from "next/head";
import { Header } from "~/components/header";
import { Bankroll } from "~/components/bankroll";
import { Sessions } from "~/components/sessions";

export default function Home() {
  return (
    <>
      <Head>
        <title>Shan BR Tracker</title>
        <meta name="description" content="bankroll tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Bankroll />
        <Sessions />
      </main>
    </>
  );
}


