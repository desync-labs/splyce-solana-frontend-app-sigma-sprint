import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AnchorWallet,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import debounce from "lodash.debounce";
import BigNumber from "bignumber.js";
import { IVault, IVaultPosition, VaultType } from "@/utils/TempData";
import {
  depositTokens,
  getTransactionBlock,
  getUserTokenBalance,
  previewDeposit,
  previewWithdraw,
  withdrawTokens,
} from "@/utils/TempSdkMethods";
import { formatNumber } from "@/utils/format";
import { MAX_PERSONAL_DEPOSIT } from "@/hooks/Vaults/useVaultOpenDeposit";
import useSyncContext from "@/context/sync";
import { getVaultIndex } from "@/utils/getVaultIndex";
import { USDC_MINT_ADDRESSES } from "@/utils/addresses";
import useBridgeContext, { BridgeType } from "@/context/bridge";

export const defaultValues = {
  formToken: "",
  formSharedToken: "",
};

export enum FormType {
  DEPOSIT,
  WITHDRAW,
}
const useVaultManageDeposit = (
  vault: IVault,
  vaultPosition: IVaultPosition,
  minimumDeposit: number,
  onClose: () => void
) => {
  const { depositLimit, balanceTokens, token, shareToken, shutdown, type } =
    vault;
  const { balancePosition, balanceShares } = vaultPosition;
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet() as AnchorWallet;
  const { lastTransactionBlock, setLastTransactionBlock } = useSyncContext();
  const { bridgeInfo } = useBridgeContext();

  const methods = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (
      USDC_MINT_ADDRESSES.includes(token.id.toLowerCase()) &&
      bridgeInfo.type === BridgeType.CreateVaultDepositFromBridgedUSDC
    ) {
      console.log("set value", bridgeInfo.amount);
      setValue("formToken", bridgeInfo.amount);
    }
  }, [bridgeInfo, token, setValue]);

  const [formType, setFormType] = useState<FormType>(
    shutdown ? FormType.WITHDRAW : FormType.DEPOSIT
  );
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [isWalletFetching, setIsWalletFetching] = useState<boolean>(false);
  const [openDepositLoading, setOpenDepositLoading] = useState<boolean>(false);
  const [isFullWithdraw, setIsFullWithdraw] = useState<boolean>(false);

  const formToken = watch("formToken");
  const formSharedToken = watch("formSharedToken");

  const getVaultTokenBalance = useCallback(async () => {
    if (!publicKey || !token?.id) {
      return;
    }
    const balance = await getUserTokenBalance(publicKey, token.id);
    setWalletBalance(balance as string);
    setIsWalletFetching(true);
  }, [publicKey, token?.id, setWalletBalance, setIsWalletFetching]);

  const updateSharedAmount = useMemo(
    () =>
      debounce(async (deposit: string) => {
        let sharedAmount = "0";

        if (isFullWithdraw) {
          setIsFullWithdraw(false);
          return;
        }

        if (formType === FormType.DEPOSIT) {
          sharedAmount = await previewDeposit(deposit, vault.id);
        } else {
          sharedAmount = await previewWithdraw(deposit, vault.id);
        }

        const sharedConverted = BigNumber(sharedAmount).toString();

        setValue("formSharedToken", sharedConverted);
      }, 500),
    [vault.id, formType, isFullWithdraw, setIsFullWithdraw]
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    timeout = setTimeout(() => {
      getVaultTokenBalance();
    }, 300);

    return () => clearTimeout(timeout);
  }, [publicKey, token?.id, getVaultTokenBalance, lastTransactionBlock]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (formToken.toString().trim() && BigNumber(formToken).isGreaterThan(0)) {
      updateSharedAmount(formToken);
    } else {
      timeout = setTimeout(() => {
        setValue("formSharedToken", "");
      }, 600);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [formToken, updateSharedAmount, setValue]);

  const setMax = useCallback(() => {
    if (formType === FormType.DEPOSIT) {
      if (type === VaultType.TRADEFI) {
        const max = BigNumber.min(walletBalance, depositLimit)
          .dividedBy(10 ** token.decimals)
          .decimalPlaces(6, BigNumber.ROUND_DOWN);

        const maxCapped = max.isNegative() ? BigNumber(0) : max;

        setValue("formToken", maxCapped.toString(), {
          shouldValidate: true,
        });
      } else {
        const max = BigNumber.min(
          BigNumber(walletBalance).dividedBy(10 ** token.decimals),
          BigNumber(depositLimit)
            .minus(balanceTokens)
            .dividedBy(10 ** token.decimals),
          BigNumber(MAX_PERSONAL_DEPOSIT).minus(
            BigNumber(balancePosition).dividedBy(10 ** token.decimals)
          )
        ).decimalPlaces(6, BigNumber.ROUND_DOWN);
        console.log("max", max.toString());

        const maxCapped = max.isNegative() ? BigNumber(0) : max;

        setValue("formToken", maxCapped.toString(), {
          shouldValidate: true,
        });
      }
    } else {
      setIsFullWithdraw(true);
      setValue(
        "formToken",
        BigNumber(balancePosition)
          .dividedBy(10 ** token.decimals)
          .toString(),
        { shouldValidate: true }
      );
      setValue(
        "formSharedToken",
        BigNumber(balanceShares)
          .dividedBy(10 ** shareToken.decimals)
          .toString(),
        { shouldValidate: true }
      );
    }
  }, [
    setValue,
    setIsFullWithdraw,
    isFullWithdraw,
    walletBalance,
    balancePosition,
    depositLimit,
    balanceTokens,
    formType,
    balanceShares,
  ]);

  const validateDeposit = (
    value: string,
    maxWalletBalance: BigNumber,
    maxDepositLimit: BigNumber
  ) => {
    if (BigNumber(value).isGreaterThan(maxWalletBalance)) {
      return "You do not have enough money in your wallet";
    }

    if (BigNumber(value).isGreaterThan(maxDepositLimit)) {
      return `Deposit value exceeds the maximum allowed limit ${formatNumber(
        maxDepositLimit.toNumber()
      )} ${token.symbol}`;
    }

    const formattedDeposit = BigNumber(depositLimit).dividedBy(
      10 ** token.decimals
    );
    const rule =
      type === VaultType.TRADEFI
        ? BigNumber(value).isGreaterThan(formattedDeposit)
        : BigNumber(balancePosition)
            .dividedBy(10 ** token.decimals)
            .plus(value)
            .isGreaterThan(formattedDeposit);

    if (rule) {
      return `The ${formattedDeposit.toNumber() / 1000}k ${
        token.symbol
      } limit has been exceeded. Please reduce the amount to continue.`;
    }

    return true;
  };

  const validateRepay = (value: string, maxBalanceToken: BigNumber) => {
    if (BigNumber(value).isGreaterThan(maxBalanceToken)) {
      return "You don't have enough to repay that amount";
    }

    return true;
  };

  const validateMaxValue = useCallback(
    (value: string) => {
      if (formType === FormType.DEPOSIT) {
        const maxWalletBalance = BigNumber(walletBalance).dividedBy(
          10 ** token.decimals
        );
        const formattedDepositLimit = BigNumber(depositLimit).dividedBy(
          10 ** token.decimals
        );
        const maxDepositLimit =
          type === VaultType.TRADEFI
            ? BigNumber.max(formattedDepositLimit, 0)
            : BigNumber.max(
                BigNumber(formattedDepositLimit)
                  .minus(
                    BigNumber(balanceTokens).dividedBy(10 ** token.decimals)
                  )
                  .toNumber(),
                0
              );

        return validateDeposit(value, maxWalletBalance, maxDepositLimit);
      } else {
        const maxBalanceToken = BigNumber(balancePosition).dividedBy(
          10 ** token.decimals
        );
        return validateRepay(value, maxBalanceToken);
      }
    },
    [depositLimit, balanceTokens, walletBalance, balancePosition, formType]
  );

  const withdrawLimitExceeded = (value: string) => {
    /**
     * Logic for TradeFlowVault
     */
    if (type === VaultType.TRADEFI) {
      const maxBalanceToken = BigNumber(balancePosition).dividedBy(
        10 ** token.decimals
      );

      if (
        BigNumber(maxBalanceToken).minus(value).isGreaterThan(0) &&
        BigNumber(maxBalanceToken).minus(value).isLessThan(minimumDeposit)
      ) {
        return `After withdraw ${formatNumber(Number(value))} ${
          token.name
        }  you will have ${formatNumber(
          BigNumber(maxBalanceToken).minus(value).toNumber()
        )} ${token.name} less then minimum allowed deposit ${
          minimumDeposit / 1000
        }k ${token.name}, you can do full withdraw instead.`;
      }
      return false;
    } else {
      return false;
    }
  };

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      if (!publicKey || !anchorWallet || !token) {
        return;
      }
      setOpenDepositLoading(true);

      const { formToken, formSharedToken } = values;

      const tokenPublicKey = new PublicKey(token.id);
      const sharedTokenPublicKey = new PublicKey(shareToken.id);
      const formattedAmount = BigNumber(formToken)
        .multipliedBy(10 ** token.decimals)
        .toString();

      if (formType === FormType.DEPOSIT) {
        try {
          depositTokens(
            publicKey,
            formattedAmount,
            anchorWallet,
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
      } else {
        try {
          withdrawTokens(
            publicKey,
            formattedAmount,
            anchorWallet,
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
          console.error("Error withdrawing tokens:", error);
          setOpenDepositLoading(false);
        }
      }
    },
    [formType, anchorWallet]
  );

  return {
    control,
    formType,
    formToken,
    formSharedToken,
    errors,
    setFormType,
    walletBalance,
    isWalletFetching,
    openDepositLoading,
    balancePosition,
    setMax,
    validateMaxValue,
    handleSubmit,
    onSubmit,
    methods,
    withdrawLimitExceeded,
  };
};

export default useVaultManageDeposit;
