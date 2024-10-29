import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import {
  defaultNetWork,
  SUBGRAPH_URLS,
  VAULTS_SUBGRAPH_URL_PROD,
} from "@/utils/network";

/***
 * For Query we have pagination, So we need to return incoming items
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        strategyHistoricalAprs: {
          keyArgs: ["strategy", "network"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        strategyReports: {
          keyArgs: ["strategy", "network"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        accountVaultPositions: {
          keyArgs: ["account"],
          merge(_, incoming) {
            return incoming;
          },
        },
        vaults: {
          keyArgs: ["network"],
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

if (process.env.NEXT_PUBLIC_ENV === "dev") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const httpLink = new HttpLink({ uri: SUBGRAPH_URLS[defaultNetWork] });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers

  let uri: string = "";

  if (process.env.NEXT_PUBLIC_ENV === "prod") {
    if (operation.getContext().clientName === "vaults") {
      uri = VAULTS_SUBGRAPH_URL_PROD;
    }
  } else {
    const network = operation.getContext().network;

    uri =
      network && (SUBGRAPH_URLS as any)[network]
        ? (SUBGRAPH_URLS as any)[network]
        : SUBGRAPH_URLS[defaultNetWork];

    if (operation.getContext().clientName === "vaults") {
      uri += "/subgraphs/name/splyce-vault-subgraph";
    }
  }

  operation.setContext(() => ({
    uri,
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
});
