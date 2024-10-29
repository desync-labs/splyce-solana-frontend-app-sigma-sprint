import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";

import { formatNumber, formatPercentage } from "@/utils/format";
import useVaultContext from "@/context/vaultDetail";
import { BaseInfoIcon } from "@/components/Base/Icons/StyledIcons";
import { IVault } from "@/utils/TempData";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletConnectBtn from "@/components/Base/WalletConnectBtn";
import { BaseDialogSummary } from "@/components/Base/Form/StyledForm";
import {
  BaseErrorBox,
  BaseWarningBox,
} from "@/components/Base/Boxes/StyledBoxes";
import { BaseListItem } from "@/components/Base/List/StyledList";
import { BaseDialogButtonWrapper } from "@/components/Base/Dialog/StyledDialog";

export const ManageVaultInfoWrapper = styled(Box)`
  position: relative;
  width: 50%;
  background: #3a4f6a;
  border-radius: 12px;
  padding: 16px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

export const VaultList = styled(List)`
  & li {
    color: #fff;
    align-items: flex-start;
    padding: 4px 0;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    & li {
      font-size: 12px;
      font-weight: 400;
      padding: 2px 0;

      & .MuiListItemSecondaryAction-root span {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
`;

type DepositVaultInfoProps = {
  vaultItemData: IVault;
  deposit: string;
  sharedToken: string;
  isWalletFetching: boolean;
  walletBalance: string;
  onClose: () => void;
  openDepositLoading: boolean;
  errors: FieldErrors<{
    formToken: string;
    formSharedToken: string;
  }>;
  approveBtn: boolean;
  approve: () => void;
  approvalPending: boolean;
  handleSubmit: UseFormHandleSubmit<
    {
      deposit: string;
      sharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
};

const DepositVaultInfo: FC<DepositVaultInfoProps> = ({
  vaultItemData,
  deposit,
  sharedToken,
  isWalletFetching,
  walletBalance,
  onClose,
  approve,
  approvalPending,
  openDepositLoading,
  errors,
  approveBtn,
  handleSubmit,
  onSubmit,
}) => {
  const { isTfVaultType, isUserKycPassed } = useVaultContext();
  const { token, shareToken, sharesSupply } = vaultItemData;
  const { connected } = useWallet();

  return (
    <ManageVaultInfoWrapper>
      <BaseDialogSummary sx={{ paddingBottom: "4px" }}>
        Summary
      </BaseDialogSummary>
      <Divider sx={{ borderColor: "#5A799D" }} />
      <VaultList>
        <BaseListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 {token?.name + " "}
              <Box component="span" sx={{ color: "#3DA329" }}>
                → {formatPercentage(Number(deposit || "0")) + " " + token?.name}
              </Box>
            </>
          }
        >
          <ListItemText primary={token?.name + " Deposited"} />
        </BaseListItem>
        <BaseListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 %{" "}
              <Box component="span" sx={{ color: "#3DA329" }}>
                →{" "}
                {
                  // todo: chenge to sharesSupply when it will be available
                  BigNumber(sharedToken).isGreaterThan(0) ||
                  BigNumber(vaultItemData.totalShare).isGreaterThan(0)
                    ? formatNumber(
                        BigNumber(sharedToken || "0")
                          .multipliedBy(10 ** shareToken?.decimals)
                          .dividedBy(
                            BigNumber(vaultItemData.totalShare).plus(
                              BigNumber(sharedToken || "0").multipliedBy(
                                10 ** shareToken?.decimals
                              )
                            )
                          )
                          .times(100)
                          .toNumber()
                      )
                    : "0"
                }{" "}
                %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </BaseListItem>
        <BaseListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {`0 ${shareToken?.symbol} `}
              <Box component="span" sx={{ color: "#3DA329" }}>
                →{" "}
                {formatPercentage(Number(sharedToken || "0")) +
                  " " +
                  shareToken?.symbol}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </BaseListItem>
      </VaultList>
      {isWalletFetching &&
        (BigNumber(walletBalance)
          .dividedBy(10 ** token.decimals)
          .isLessThan(BigNumber(deposit)) ||
          walletBalance == "0") && (
          <BaseErrorBox sx={{ marginBottom: 0 }}>
            <BaseInfoIcon />
            <Typography>Wallet balance is not enough to deposit.</Typography>
          </BaseErrorBox>
        )}
      {isTfVaultType && !isUserKycPassed && (
        <BaseWarningBox>
          <BaseInfoIcon
            sx={{ width: "20px", color: "#F5953D", height: "20px" }}
          />
          <Box flexDirection="column">
            <Typography width="100%">
              Only KYC-verified users can deposit. Please completing KYC at{" "}
              <a
                href={"https://kyc.tradeflow.network/"}
                target={"_blank"}
                rel={"noreferrer"}
              >
                https://kyc.tradeflow.network/
              </a>
            </Typography>
          </Box>
        </BaseWarningBox>
      )}
      <BaseDialogButtonWrapper sx={{ paddingTop: "8px" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={approvalPending || openDepositLoading}
        >
          Reset
        </Button>
        {!connected ? (
          <WalletConnectBtn />
        ) : approveBtn && walletBalance !== "0" ? (
          <Button
            variant="gradient"
            onClick={approve}
            disabled={
              !!Object.keys(errors).length ||
              (isTfVaultType && !isUserKycPassed) ||
              approvalPending
            }
          >
            {" "}
            {approvalPending ? (
              <CircularProgress size={20} />
            ) : (
              "Approve token"
            )}{" "}
          </Button>
        ) : (
          <Button
            variant="gradient"
            onClick={handleSubmit(onSubmit)}
            disabled={
              openDepositLoading ||
              approveBtn ||
              !!Object.keys(errors).length ||
              (isTfVaultType && !isUserKycPassed)
            }
          >
            {openDepositLoading ? <CircularProgress size={20} /> : "Deposit"}
          </Button>
        )}
      </BaseDialogButtonWrapper>
    </ManageVaultInfoWrapper>
  );
};

export default memo(DepositVaultInfo);
