import type { AppProps } from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";
import "@/theme/globals.css";

const DynamicProviders = dynamic(
  () => import("@/provider").then((mod) => mod.Providers),
  { ssr: false }
);
const AppNavLayout = dynamic(
  () => import("@/components/AppLayout/AppNavLayout")
);

const MyApp = ({ Component, pageProps, ...props }: AppProps) => {
  console.log("_app props: ", props);
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#000205" />
        <meta name="theme-color" content="#000205" />
        <title>Splyce Liquidity Protocol</title>
        <meta name="title" content="Splyce Liquidity Protocol" />
        <meta
          name="description"
          content="Splyce is a borrow &amp; earn platform where users can stake SOL and tokenized real-world assets as collateral to borrow the over-collateralized price stable currency spUSD. spUSD Stablecoin - RWA Liquidity - Lending."
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Splyce Liquidity Protocol" />
        <meta
          property="og:description"
          content="Splyce is a borrow &amp; earn platform where users can stake SOL and tokenized real-world assets as collateral to borrow the over-collateralized price stable currency spUSD. spUSD Stablecoin - RWA Liquidity - Lending."
        />
        <meta property="og:url" content="https://app.splyce.finance" />
        <meta property="og:site_name" content="Splyce Liquidity Protocol" />
        <meta
          property="article:modified_time"
          content="2023-03-21T10:06:39+00:00"
        />
        <meta property="og:image" content="/splyce-site-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Splycefi" />
        <meta
          name="keywords"
          content="Decentralized Finance, DeFi, RWA, spUSD, stablecoins, lending, borrowing, assets, smart contracts, open finance, trustless"
        />
        <link rel="apple-touch-icon" href="/splyce-site-preview.png" />
        <meta
          name="apple-mobile-web-app-title"
          content="Splyce Liquidity Protocol"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <title>
          {pageProps?.title ? `${pageProps.title} Splyce` : "Splyce"}
        </title>
      </Head>
      <DynamicProviders>
        <AppNavLayout>
          <Component {...pageProps} />
        </AppNavLayout>
      </DynamicProviders>
    </>
  );
};

export default MyApp;
