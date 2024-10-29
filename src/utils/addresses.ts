import { PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// Token addresses
const TEST_TOKEN_PUBLIC_KEY_DEV = new PublicKey(
  "gMiieh8f3j6VVRaSKqxa2iiznqXCNkY6ocr65YCY7i1"
);
const TEST_TOKEN_PUBLIC_KEY_MAINNET = new PublicKey(
  "4N37FD6SU35ssX6yTu2AcCvzVbdS6z3YZTtk5gv7ejhE"
);

export const TEST_TOKEN_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? TEST_TOKEN_PUBLIC_KEY_MAINNET
    : TEST_TOKEN_PUBLIC_KEY_DEV;

// Faucet addresses
const FAUCET_DATA_PUB_KEY_DEV = new PublicKey(
  "Fx6qTeZEk8UxJuTjZ9REThtsocHiukjP9iTd87qgfCui"
);
const FAUCET_DATA_PUB_KEY_MAINNET = new PublicKey(
  "84aAmYBsJWBZWbsgeBS6MSuFsGUGLAqaofVMLD4DZXtP"
);

const FAUCET_TOKEN_ACCOUNT_PUB_KEY_DEV = new PublicKey(
  "8BEaXawL7MeRYbmtnmHKFZrn52irAjxYJL3RwPfkHa7M"
);
const FAUCET_TOKEN_ACCOUNT_PUB_KEY_MAINNET = new PublicKey(
  "3zztMz1BaGckpyNhrTTRBBgfNpFn9kj4VzkyCGCxHnWB"
);

export const FAUCET_DATA_PUB_KEY =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? FAUCET_DATA_PUB_KEY_MAINNET
    : FAUCET_DATA_PUB_KEY_DEV;

export const FAUCET_TOKEN_ACCOUNT_PUB_KEY =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? FAUCET_TOKEN_ACCOUNT_PUB_KEY_MAINNET
    : FAUCET_TOKEN_ACCOUNT_PUB_KEY_DEV;

// Vault program addresses
export const vaultProgramIds = {
  [WalletAdapterNetwork.Mainnet]:
    "5R6bVKZfag4X9vW4nek6UNP8XXwH7cPaVohyAo1xfVEU",
  [WalletAdapterNetwork.Devnet]: "ATdWqQQrwKbwbGv2zmD2nfcXsmTVA62eXWEtundAdwfE",
  [WalletAdapterNetwork.Testnet]:
    "ATdWqQQrwKbwbGv2zmD2nfcXsmTVA62eXWEtundAdwfE",
};

export const strategyProgramIds = {
  [WalletAdapterNetwork.Mainnet]:
    "FeMChq4ZCFP8UstbyHnVyme3ATa2vtteLNCwms4jLMAj",
  [WalletAdapterNetwork.Devnet]: "5rQVgdeNp4RMUXjL8B8ksajVNywLoS7rK9e5yD4pi983",
  [WalletAdapterNetwork.Testnet]:
    "5rQVgdeNp4RMUXjL8B8ksajVNywLoS7rK9e5yD4pi983",
};

export const faucetProgramIds = {
  [WalletAdapterNetwork.Mainnet]:
    "4rza9AifAapN4SKho3teAuLhc1TPpNWp9DHNPEMzVqgp",
  [WalletAdapterNetwork.Devnet]: "84SxMfjJ3xZzZFCEsZSaPJWF7aWQBiyXq4KMaC4k892Y",
  [WalletAdapterNetwork.Testnet]:
    "84SxMfjJ3xZzZFCEsZSaPJWF7aWQBiyXq4KMaC4k892Y",
};

export const USDC_MINT_ADDRESSES = [
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".toLowerCase(),
  "5aa3HkBenNLtJwccrNDYri1FrqfB7U2oWQsRanbGRHot".toLowerCase(),
];

export const USDC_MINT_ADDRESSES_SHARED = [
  "5aa3HkBenNLtJwccrNDYri1FrqfB7U2oWQsRanbGRHot".toLowerCase(),
];
