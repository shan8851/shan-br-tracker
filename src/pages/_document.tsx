import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme='cyberpunk'>
      <Head>
        <meta property="og:title" content="Shan BR Tracker" />
        <meta property="og:description" content="bankroll tracker" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https:/shan-br-tracker.vercel.app" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
