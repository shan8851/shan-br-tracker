import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme='cyberpunk'>
      <Head>
        {/* Open Graph tags */}
        <meta property="og:title" content="Bankroll Tracker" />
        <meta property="og:description" content="Live poker bankroll tracker" />
        <meta property="og:image" content="/roll/jpeg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shan-br-tracker.vercel.app/" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shan8851" />
        <meta name="twitter:description" content="Live poker bankroll tracker" />
        <meta name="twitter:image" content="/roll/jpeg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
