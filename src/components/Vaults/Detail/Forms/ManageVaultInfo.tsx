import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  ListItemText,
  Typography,
} from "@mui/material";

import { FormType } from "@/hooks/Vaults/useVaultManageDeposit";
import { formatNumber, formatPercentage } from "@/utils/format";
import { IVault, IVaultPosition } from "@/utils/TempData";
import {
  ManageVaultInfoWrapper,
  VaultList,
} from "@/components/Vaults/Detail/Forms/DepositVaultInfo";
import { BaseDialogSummary } from "@/components/Base/Form/StyledForm";
import { BaseListItem } from "@/components/Base/List/StyledList";
import WalletConnectBtn from "@/components/Base/WalletConnectBtn";
import { BaseDialogButtonWrapper } from "@/components/Base/Dialog/StyledDialog";
import { BaseErrorBox } from "@/components/Base/Boxes/StyledBoxes";
import { BaseInfoIcon } from "@/components/Base/Icons/StyledIcons";

type VaultManageInfoProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  formToken: string;
  formSharedToken: string;
  formType: FormType;
  isWalletFetching: boolean;
  walletBalance: string;
  onClose: () => void;
  openDepositLoading: boolean;
  errors: FieldErrors<{
    formToken: string;
    formSharedToken: string;
  }>;
  approveBtn: boolean;
  handleSubmit: UseFormHandleSubmit<
    {
      formToken: string;
      formSharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  withdrawLimitExceeded: (value: string) => string | boolean;
};

const ManageVaultInfo: FC<VaultManageInfoProps> = ({
  formType,
  vaultItemData,
  vaultPosition,
  formToken,
  formSharedToken,
  isWalletFetching,
  walletBalance,
  onClose,
  openDepositLoading,
  errors,
  approveBtn,
  handleSubmit,
  onSubmit,
  withdrawLimitExceeded,
}) => {
  const { token, shareToken, sharesSupply } = vaultItemData;
  const { balancePosition, balanceShares } = vaultPosition;
  const { publicKey } = useWallet();

  return (
    <ManageVaultInfoWrapper>
      <BaseDialogSummary sx={{ paddingBottom: "4px" }}>
        Summary
      </BaseDialogSummary>
      <Divider sx={{ borderColor: "#5A799D" }} />
      <VaultList>
        <BaseListItem
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balancePosition)
                  .dividedBy(10 ** token?.decimals)
                  .toNumber()
              ) +
                " " +
                token?.name +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balancePosition)
                        .dividedBy(10 ** token?.decimals)
                        .plus(BigNumber(formToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    token?.name +
                    " "
                  : formatPercentage(
                      Math.max(
                        BigNumber(balancePosition)
                          .dividedBy(10 ** token?.decimals)
                          .minus(BigNumber(formToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    token?.name +
                    " "}
              </Box>
            </>
          }
        >
          <ListItemText primary={token?.name + " Deposited"} />
        </BaseListItem>
        <BaseListItem
          secondaryAction={
            <>
              {`${formatNumber(
                BigNumber(balanceShares)
                  // todo: chenge to sharesSupply when it will be available
                  .dividedBy(BigNumber(vaultItemData.totalShare))
                  .multipliedBy(100)
                  .toNumber()
              )} %`}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatNumber(
                      BigNumber(balanceShares)
                        .plus(
                          BigNumber(formSharedToken || "0").multipliedBy(
                            10 ** shareToken?.decimals
                          )
                        )
                        .dividedBy(
                          // todo: chenge to sharesSupply when it will be available
                          BigNumber(vaultItemData.totalShare).plus(
                            BigNumber(formSharedToken || "0").multipliedBy(
                              10 ** shareToken?.decimals
                            )
                          )
                        )
                        .multipliedBy(100)
                        .toNumber()
                    )
                  : BigNumber(formSharedToken)
                        .multipliedBy(10 ** shareToken?.decimals)
                        // todo: chenge to sharesSupply when it will be available
                        .isEqualTo(BigNumber(vaultItemData.totalShare))
                    ? "0"
                    : formatNumber(
                        Math.max(
                          BigNumber(balanceShares)
                            .minus(
                              BigNumber(formSharedToken || "0").multipliedBy(
                                10 ** shareToken?.decimals
                              )
                            )
                            .dividedBy(
                              // todo: chenge to sharesSupply when it will be available
                              BigNumber(vaultItemData.totalShare).minus(
                                BigNumber(formSharedToken || "0").multipliedBy(
                                  10 ** shareToken?.decimals
                                )
                              )
                            )
                            .multipliedBy(100)
                            .toNumber(),
                          0
                        )
                      )}{" "}
                %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </BaseListItem>
        <BaseListItem
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balanceShares)
                  .dividedBy(10 ** shareToken?.decimals)
                  .toNumber()
              ) +
                " " +
                shareToken?.symbol +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balanceShares)
                        .dividedBy(10 ** shareToken?.decimals)
                        .plus(BigNumber(formSharedToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    shareToken?.symbol
                  : formatPercentage(
                      Math.max(
                        BigNumber(balanceShares)
                          .dividedBy(10 ** shareToken?.decimals)
                          .minus(BigNumber(formSharedToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    shareToken?.symbol}{" "}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </BaseListItem>
      </VaultList>
      {isWalletFetching &&
        formType === FormType.DEPOSIT &&
        (BigNumber(walletBalance)
          .dividedBy(10 ** token?.decimals)
          .isLessThan(formToken) ||
          walletBalance == "0") && (
          <BaseErrorBox sx={{ marginBottom: 0 }}>
            <BaseInfoIcon />
            <Typography>Wallet balance is not enough to deposit.</Typography>
          </BaseErrorBox>
        )}
      {formType === FormType.WITHDRAW && withdrawLimitExceeded(formToken) && (
        <BaseErrorBox sx={{ marginBottom: 0 }}>
          <BaseInfoIcon />
          <Typography>{withdrawLimitExceeded(formToken)}</Typography>
        </BaseErrorBox>
      )}
      <BaseDialogButtonWrapper sx={{ paddingTop: "8px" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={openDepositLoading}
        >
          Reset
        </Button>
        {!publicKey ? (
          <WalletConnectBtn />
        ) : (
          <Button
            variant="gradient"
            onClick={handleSubmit(onSubmit)}
            disabled={
              openDepositLoading ||
              (formType === FormType.DEPOSIT && approveBtn) ||
              !!Object.keys(errors).length ||
              (formType === FormType.WITHDRAW &&
                !!withdrawLimitExceeded(formToken))
            }
          >
            {openDepositLoading ? (
              <CircularProgress size={20} />
            ) : formType === FormType.DEPOSIT ? (
              "Deposit"
            ) : (
              "Withdraw"
            )}
          </Button>
        )}
      </BaseDialogButtonWrapper>
    </ManageVaultInfoWrapper>
  );
};

export default memo(ManageVaultInfo);
