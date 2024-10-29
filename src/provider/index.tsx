import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import WalletProvider from "@/provider/WalletProvider";
import { AppThemeProvider } from "@/provider/ThemeProvider";
import { SharedProvider } from "@/context/shared";
import { client } from "@/apollo/client";
import { SyncProvider } from "@/context/sync";

export { WalletProvider, AppThemeProvider };

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AppThemeProvider>
      <SharedProvider>
        <WalletProvider>
          <ApolloProvider client={client}>
            <SyncProvider>{children}</SyncProvider>
          </ApolloProvider>
        </WalletProvider>
      </SharedProvider>
    </AppThemeProvider>
  );
};
