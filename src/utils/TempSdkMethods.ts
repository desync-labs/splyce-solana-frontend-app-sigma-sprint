import {
  type Commitment,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import type { Account } from "@solana/spl-token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  TokenInvalidMintError,
  TokenInvalidOwnerError,
} from "@solana/spl-token";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { defaultEndpoint } from "@/utils/network";
import { getIdl, IdlTypes } from "@/utils/getIdl";
import {
  FAUCET_DATA_PUB_KEY,
  FAUCET_TOKEN_ACCOUNT_PUB_KEY,
} from "@/utils/addresses";
import BigNumber from "bignumber.js";

const connection = new Connection(defaultEndpoint);

export const getUserSolanaBalance = async (walletPublicKey: PublicKey) => {
  if (!walletPublicKey) {
    console.error("User wallet public key is required");
    return;
  }

  try {
    const balanceLamports = await connection.getBalance(
      new PublicKey(walletPublicKey)
    );

    return balanceLamports / 1e9;
  } catch (error) {
    console.error("Error fetching balance of SOL", error);
  }
};

export const getUserTokenBalance = async (
  publicKey: PublicKey,
  tokenMintAddress: string
) => {
  if (!tokenMintAddress || !publicKey) {
    return;
  }

  const tokenMintPublicKey = new PublicKey(tokenMintAddress);

  try {
    // Associated Token Accounts
    const accounts = await connection.getTokenAccountsByOwner(publicKey, {
      mint: tokenMintPublicKey,
    });

    if (accounts.value.length > 0) {
      const associatedTokenAccountPubKey = accounts.value[0].pubkey;
      const tokenAccountInfo = await getAccount(
        connection,
        associatedTokenAccountPubKey,
        "processed"
      );

      return tokenAccountInfo.amount.toString();
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error getting token balance:", error);
    return 0;
  }
};

export const depositTokens = async (
  userPublicKey: PublicKey,
  amount: string,
  wallet: AnchorWallet,
  tokenPubKey: PublicKey,
  shareTokenPubKey: PublicKey,
  vaultIndex: number
) => {
  if (!userPublicKey || !wallet) {
    return;
  }

  const provider = new AnchorProvider(
    new Connection(defaultEndpoint, "confirmed"),
    wallet,
    {
      preflightCommitment: "confirmed",
    }
  );

  const vaultProgram = new Program(getIdl(IdlTypes.VAULT), provider);

  const vaultPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      Buffer.from(
        new Uint8Array(new BigUint64Array([BigInt(vaultIndex)]).buffer)
      ),
    ],
    vaultProgram.programId
  )[0];

  const userTokenAccount = await getOrCreateTokenAssociatedAccount(
    wallet,
    tokenPubKey,
    userPublicKey
  );

  const userSharesAccount = await getOrCreateTokenAssociatedAccount(
    wallet,
    shareTokenPubKey,
    userPublicKey
  );

  try {
    const tx = new Transaction().add(
      await vaultProgram.methods
        .deposit(new BN(amount))
        .accounts({
          vault: vaultPDA,
          user: userPublicKey,
          userTokenAccount: userTokenAccount.address,
          userSharesAccount: userSharesAccount.address,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction()
    );

    // Send Tx
    return await provider.sendAndConfirm(tx);
  } catch (err) {
    console.error("Error deposit tx:", err);
  }
};

export const withdrawTokens = async (
  userPublicKey: PublicKey,
  amount: string,
  wallet: AnchorWallet,
  tokenPubKey: PublicKey,
  shareTokenPubKey: PublicKey,
  vaultIndex: number
) => {
  if (!userPublicKey || !wallet) {
    return;
  }

  const provider = new AnchorProvider(
    new Connection(defaultEndpoint, "confirmed"),
    wallet,
    {
      preflightCommitment: "confirmed",
    }
  );

  const vaultProgram = new Program(getIdl(IdlTypes.VAULT), provider);
  const strategyProgram = new Program(getIdl(IdlTypes.STRATEGY), provider);

  const vaultPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      Buffer.from(
        new Uint8Array(new BigUint64Array([BigInt(vaultIndex)]).buffer)
      ),
    ],
    vaultProgram.programId
  )[0];

  const strategyPDA = PublicKey.findProgramAddressSync(
    [vaultPDA.toBuffer(), Buffer.from(new Uint8Array([0]))],
    strategyProgram.programId
  )[0];

  const userTokenAccount = await getOrCreateTokenAssociatedAccount(
    wallet,
    tokenPubKey,
    userPublicKey
  );

  const userSharesAccount = await getOrCreateTokenAssociatedAccount(
    wallet,
    shareTokenPubKey,
    userPublicKey
  );

  const strategyTokenAccount = PublicKey.findProgramAddressSync(
    [Buffer.from("underlying"), strategyPDA.toBuffer()],
    strategyProgram.programId
  )[0];

  const remainingAccountsMap = {
    accountsMap: [
      {
        strategyAcc: new BN(0),
        strategyTokenAccount: new BN(1),
        remainingAccountsToStrategies: [new BN(0)],
      },
    ],
  };

  try {
    const tx = new Transaction().add(
      await vaultProgram.methods
        .withdraw(new BN(amount), new BN(10000), remainingAccountsMap)
        .accounts({
          vault: vaultPDA,
          user: userPublicKey,
          userTokenAccount: userTokenAccount.address,
          userSharesAccount: userSharesAccount.address,
          tokenProgram: TOKEN_PROGRAM_ID,
          strategyProgram: strategyProgram.programId,
        })
        .remainingAccounts([
          {
            pubkey: strategyPDA,
            isWritable: true,
            isSigner: false,
          },
          { pubkey: strategyTokenAccount, isWritable: true, isSigner: false },
        ])
        .instruction()
    );

    // Send Tx
    const signature = await provider.sendAndConfirm(tx);
    console.log("Withdraw tx successes:", signature);
    return signature;
  } catch (err) {
    console.error("Error deposit tx:", err);
  }
};

export const getOrCreateTokenAssociatedAccount = async (
  wallet: AnchorWallet,
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) => {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "finalized",
  });

  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId
  );

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account: Account;
  try {
    account = await getAccount(
      connection,
      associatedToken,
      commitment,
      programId
    );
  } catch (error: unknown) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      try {
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedToken,
            owner,
            mint,
            programId,
            associatedTokenProgramId
          )
        );

        await provider.sendAndConfirm(transaction);
      } catch (error: unknown) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }

      // Now this should always succeed
      account = await getAccount(
        connection,
        associatedToken,
        commitment,
        programId
      );
    } else {
      throw error;
    }
  }

  if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
  if (!account.owner.equals(owner)) throw new TokenInvalidOwnerError();

  return account;
};

export const previewRedeem = async (shareBalance: string, vaultId: string) => {
  // todo: implement preview redeem from program
  return shareBalance;
};

export const previewDeposit = async (tokenAmount: string, vaultId: string) => {
  // todo: implement preview deposit from program
  if (vaultId.toLowerCase() === "W723RTUpoZ".toLowerCase()) {
    return BigNumber(tokenAmount)
      .dividedBy(10 ** 3)
      .toString();
  }
  return tokenAmount;
};

export const previewWithdraw = async (tokenAmount: string, vaultId: string) => {
  // todo: implement preview withdraw from program
  if (vaultId.toLowerCase() === "W723RTUpoZ".toLowerCase()) {
    return BigNumber(tokenAmount)
      .dividedBy(10 ** 3)
      .toString();
  }
  return tokenAmount;
};

export const getTransactionBlock = async (signature: string) => {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
    if (!transaction) {
      return;
    }
    return transaction.slot;
  } catch (error) {
    console.error("Error getting transaction block:", error);
    return;
  }
};

export const faucetTestToken = async (
  userPubKey: PublicKey,
  tokenPubKey: PublicKey,
  wallet: AnchorWallet
) => {
  if (!userPubKey || !wallet || !tokenPubKey) {
    return;
  }
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });

  const faucetProgram = new Program(getIdl(IdlTypes.FAUCET), provider);

  const userTokenAccount = await getOrCreateTokenAssociatedAccount(
    wallet,
    tokenPubKey,
    userPubKey
  );

  try {
    const tx = new Transaction().add(
      await faucetProgram.methods
        .sendTokens()
        .accounts({
          faucetData: FAUCET_DATA_PUB_KEY,
          tokenAccount: FAUCET_TOKEN_ACCOUNT_PUB_KEY,
          recipient: userTokenAccount.address,
          signer: userPubKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction()
    );

    const signature = await provider.sendAndConfirm(tx);

    // Send Tx
    return signature;
  } catch (err) {
    console.error("Error deposit tx:", err);
  }
};

export const getTfVaultPeriods = async (vaultIndex: number) => {
  const vaultProgram = new Program(getIdl(IdlTypes.VAULT), {
    connection,
  });
  const strategyProgram = new Program(getIdl(IdlTypes.STRATEGY), {
    connection,
  });

  const vaultPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      Buffer.from(
        new Uint8Array(new BigUint64Array([BigInt(vaultIndex)]).buffer)
      ),
    ],
    vaultProgram.programId
  )[0];

  const strategyPDA = PublicKey.findProgramAddressSync(
    [vaultPDA.toBuffer(), Buffer.from(new Uint8Array([0]))],
    strategyProgram.programId
  )[0];

  const strategyAccount =
    // @ts-ignore
    await strategyProgram.account.tradeFintechStrategy.fetch(strategyPDA);
  const depositPeriodEnds = strategyAccount.depositPeriodEnds;
  const lockPeriodEnds = strategyAccount.lockPeriodEnds;

  return {
    depositPeriodEnds,
    lockPeriodEnds,
  };
};

export const getVaultAddress = async (vaultIndex: number) => {
  const vaultProgram = new Program(getIdl(IdlTypes.VAULT), {
    connection,
  });

  const vaultPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      Buffer.from(
        new Uint8Array(new BigUint64Array([BigInt(vaultIndex)]).buffer)
      ),
    ],
    vaultProgram.programId
  )[0];

  return vaultPDA;
};

export const getStrategyProgramAddress = async (
  vaultIndex: number,
  strategyIndex: number
) => {
  const vaultProgram = new Program(getIdl(IdlTypes.VAULT), {
    connection,
  });

  const strategyProgram = new Program(getIdl(IdlTypes.STRATEGY), {
    connection,
  });

  const vaultPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      Buffer.from(
        new Uint8Array(new BigUint64Array([BigInt(vaultIndex)]).buffer)
      ),
    ],
    vaultProgram.programId
  )[0];

  const strategyPDA = PublicKey.findProgramAddressSync(
    [vaultPDA.toBuffer(), Buffer.from(new Uint8Array([strategyIndex]))],
    strategyProgram.programId
  )[0];

  return strategyPDA;
};
