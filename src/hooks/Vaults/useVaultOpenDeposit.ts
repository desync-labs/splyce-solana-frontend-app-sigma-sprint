import { useCallback, useEffect, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  AnchorWallet,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useForm } from "react-hook-form";

import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import { IVault, VaultType } from "@/utils/TempData";
import {
  depositTokens,
  getTransactionBlock,
  getUserTokenBalance,
  previewDeposit,
} from "@/utils/TempSdkMethods";
import useSyncContext from "@/context/sync";
import { formatNumber } from "@/utils/format";
import { getVaultIndex } from "@/utils/getVaultIndex";

export const MAX_PERSONAL_DEPOSIT = 50000;
export const defaultValues = {
  deposit: "",
  sharedToken: "",
};

const useVaultOpenDeposit = (vault: IVault, onClose: () => void) => {
  const { token, shareToken, depositLimit, balanceTokens, type } = vault;
  const { publicKey, wallet } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { lastTransactionBlock, setLastTransactionBlock } = useSyncContext();

  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [isWalletFetching, setIsWalletFetching] = useState<boolean>(false);
  const [openDepositLoading, setOpenDepositLoading] = useState<boolean>(false);

  const methods = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const deposit = watch("deposit");
  const sharedToken = watch("sharedToken");

  const getVaultTokenBalance = useCallback(async () => {
    if (!publicKey || !token?.id) {
      return;
    }
    const balance = await getUserTokenBalance(publicKey, token.id);
    setWalletBalance(balance as string);
    setIsWalletFetching(true);
  }, [publicKey, token?.id, setWalletBalance, setIsWalletFetching]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    timeout = setTimeout(() => {
      getVaultTokenBalance();
    }, 300);

    return () => clearTimeout(timeout);
  }, [publicKey, token?.id, getVaultTokenBalance, lastTransactionBlock]);

  const updateSharedAmount = useMemo(
    () =>
      debounce(async (deposit: string) => {
        const sharedAmount = await previewDeposit(deposit, vault.id);

        const sharedConverted = BigNumber(sharedAmount).toFixed();

        setValue("sharedToken", sharedConverted);
      }, 500),
    [vault?.id, deposit, setValue]
  );

  useEffect(() => {
    if (deposit && BigNumber(deposit).isGreaterThan(0)) {
      updateSharedAmount(deposit);
    } else {
      setTimeout(() => {
        setValue("sharedToken", "0");
      }, 600);
    }
  }, [deposit, setValue, updateSharedAmount]);

  const setMax = useCallback(() => {
    const maxWalletBalance = BigNumber.min(
      BigNumber(walletBalance).dividedBy(10 ** token.decimals),
      BigNumber.max(
        BigNumber(depositLimit)
          .minus(balanceTokens)
          .dividedBy(10 ** token.decimals),
        BigNumber(0)
      )
    ).decimalPlaces(6, BigNumber.ROUND_DOWN);

    setValue("deposit", maxWalletBalance.toString(), {
      shouldValidate: true,
    });
  }, [walletBalance, depositLimit, balanceTokens, setValue]);

  const depositLimitExceeded = (value: string) => {
    const formattedDepositLimit = BigNumber(depositLimit).dividedBy(
      10 ** token.decimals
    );
    const rule =
      type === VaultType.TRADEFI
        ? BigNumber(value).isGreaterThanOrEqualTo(formattedDepositLimit)
        : BigNumber(value).isGreaterThanOrEqualTo(MAX_PERSONAL_DEPOSIT);

    if (rule) {
      return `The ${
        (type === VaultType.TRADEFI
          ? formattedDepositLimit.toNumber()
          : MAX_PERSONAL_DEPOSIT) / 1000
      }k ${token.symbol} limit has been exceeded.`;
    } else {
      return false;
    }
  };

  const validateMaxDepositValue = useCallback(
    (value: string) => {
      const formattedMaxWalletBalance = BigNumber(walletBalance).dividedBy(
        10 ** token.decimals
      );
      const formattedMaxDepositLimit = BigNumber.max(
        type === VaultType.TRADEFI
          ? BigNumber(depositLimit).dividedBy(10 ** token.decimals)
          : BigNumber(depositLimit).minus(
              BigNumber(balanceTokens).dividedBy(10 ** token.decimals)
            ),
        0
      );

      if (BigNumber(value).isGreaterThan(formattedMaxWalletBalance)) {
        return "You do not have enough money in your wallet";
      }

      if (BigNumber(value).isGreaterThan(formattedMaxDepositLimit)) {
        return `Deposit value exceeds the maximum allowed limit ${formatNumber(
          formattedMaxDepositLimit.toNumber()
        )} ${token.symbol}`;
      }
      if (
        BigNumber(value).isGreaterThan(
          BigNumber(depositLimit).dividedBy(10 ** token.decimals)
        )
      ) {
        return `The ${
          BigNumber(depositLimit)
            .dividedBy(10 ** token.decimals)
            .toNumber() / 1000
        }k ${
          token.symbol
        } limit has been exceeded. Please reduce the amount to continue.`;
      }

      return true;
    },
    [type, depositLimit, balanceTokens, walletBalance]
  );

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      if (!publicKey || !wallet || !token) {
        return;
      }

      setOpenDepositLoading(true);

      const { deposit } = values;

      const tokenPublicKey = new PublicKey(token.id);
      const sharedTokenPublicKey = new PublicKey(shareToken.id);

      const formattedDepositAmount = BigNumber(deposit)
        .multipliedBy(10 ** token.decimals)
        .toString();

      try {
        depositTokens(
          publicKey,
          formattedDepositAmount,
          anchorWallet as AnchorWallet,
          tokenPublicKey,
          sharedTokenPublicKey,
          getVaultIndex(vault.id)
        )
          .then(async (txSignature) => {
            const txSlot = await getTransactionBlock(txSignature as string);

            if (txSlot) {
              setLastTransactionBlock(txSlot);
            }
          })
          .finally(() => {
            setOpenDepositLoading(false);
            onClose();
          });
      } catch (error) {
        console.error("Error depositing tokens:", error);
        setOpenDepositLoading(false);
      }
    },
    [deposit, token, shareToken, publicKey, wallet]
  );

  return {
    methods,
    walletBalance,
    isWalletFetching,
    openDepositLoading,
    control,
    deposit,
    sharedToken,
    errors,
    depositLimitExceeded,
    validateMaxDepositValue,
    setMax,
    handleSubmit,
    onSubmit,
  };
};

export default useVaultOpenDeposit;
