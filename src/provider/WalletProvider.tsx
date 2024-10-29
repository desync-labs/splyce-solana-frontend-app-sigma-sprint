import { FC, PropsWithChildren } from "react";
import React, { useMemo, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";
import { ExodusWalletAdapter } from "@solana/wallet-adapter-exodus";
import { SlopeWalletAdapter } from "@solana/wallet-adapter-slope";
import { initialize } from "@solflare-wallet/wallet-adapter";
import {
  TorusWalletAdapter,
  TrustWalletAdapter,
  MathWalletAdapter,
  TokenPocketWalletAdapter,
  CoinbaseWalletAdapter,
  SolongWalletAdapter,
  Coin98WalletAdapter,
  SafePalWalletAdapter,
  BitpieWalletAdapter,
  BitgetWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { type WalletError } from "@solana/wallet-adapter-base";
import { registerMoonGateWallet } from "@moongate/moongate-adapter";
import { WalletConnectWalletAdapter } from "@walletconnect/solana-adapter";
import { defaultEndpoint, defaultNetWork } from "@/utils/network";

initialize();

const App: FC<PropsWithChildren<any>> = ({ children }) => {
  //TODO: Add different networks
  const [network] = useState<WalletAdapterNetwork>(defaultNetWork);
  const [endpoint] = useState<string>(defaultEndpoint);

  registerMoonGateWallet({
    authMode: "Ethereum",
    position: "top-right",
    // logoDataUri: 'OPTIONAL ADD IN-WALLET LOGO URL HERE',
    // buttonLogoUri: 'ADD OPTIONAL LOGO FOR WIDGET BUTTON HERE'
  });
  registerMoonGateWallet({
    authMode: "Google",
    position: "top-right",
    // logoDataUri: 'OPTIONAL ADD IN-WALLET LOGO URL HERE',
    // buttonLogoUri: 'ADD OPTIONAL LOGO FOR WIDGET BUTTON HERE'
  });
  // registerMoonGateWallet({
  //   authMode: 'Twitter',
  //   position: 'top-right'
  //   // logoDataUri: 'OPTIONAL ADD IN-WALLET LOGO URL HERE',
  //   // buttonLogoUri: 'ADD OPTIONAL LOGO FOR WIDGET BUTTON HERE'
  // })
  registerMoonGateWallet({
    authMode: "Apple",
    position: "top-right",
    // logoDataUri: 'OPTIONAL ADD IN-WALLET LOGO URL HERE',
    // buttonLogoUri: 'ADD OPTIONAL LOGO FOR WIDGET BUTTON HERE'
  });

  const _walletConnect = useMemo(() => {
    const connectWallet: WalletConnectWalletAdapter[] = [];
    try {
      connectWallet.push(
        new WalletConnectWalletAdapter({
          network: network as WalletAdapterNetwork.Mainnet,
          options: {
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PJ_ID,
            metadata: {
              name: "Splyce",
              description: "Splyce protocol",
              url: "https://solana.splyce.finance/",
              icons: ["https://solana.splyce.finance/logo/splyce-logo.png"],
            },
          },
        })
      );
    } catch (e) {
      // console.error('WalletConnect error', e)
    }
    return connectWallet;
  }, [network]);

  const wallets = useMemo(
    () => [
      new SlopeWalletAdapter({ endpoint }),
      new TorusWalletAdapter(),
      //new LedgerWalletAdapter(),
      ..._walletConnect,
      new GlowWalletAdapter(),
      new TrustWalletAdapter(),
      new MathWalletAdapter({ endpoint }),
      new TokenPocketWalletAdapter(),
      new CoinbaseWalletAdapter({ endpoint }),
      new SolongWalletAdapter({ endpoint }),
      new Coin98WalletAdapter({ endpoint }),
      new SafePalWalletAdapter({ endpoint }),
      new BitpieWalletAdapter({ endpoint }),
      new BitgetWalletAdapter({ endpoint }),
      new ExodusWalletAdapter({ endpoint }),
    ],
    [network, endpoint]
  );

  const onWalletError = (error: WalletError) => {
    console.error("Wallet error", error);
  };

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ disableRetryOnRateLimit: true }}
    >
      <WalletProvider wallets={wallets} onError={onWalletError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
