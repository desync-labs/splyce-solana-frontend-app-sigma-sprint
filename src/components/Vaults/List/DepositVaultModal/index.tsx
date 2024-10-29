import { FC, memo } from "react";
import { FormProvider } from "react-hook-form";
import { useWallet } from "@solana/wallet-adapter-react";
import BigNumber from "bignumber.js";
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";

import useVaultOpenDeposit from "@/hooks/Vaults/useVaultOpenDeposit";
import { IVault } from "@/utils/TempData";

import WalletConnectBtn from "@/components/Base/WalletConnectBtn";
import { BaseInfoIcon } from "@/components/Base/Icons/StyledIcons";
import { BaseDialogTitle } from "@/components/Base/Dialog/BaseDialogTitle";
import DepositVaultInfo from "@/components/Vaults/List/DepositVaultModal/DepositVaultInfo";
import DepositVaultForm from "@/components/Vaults/List/DepositVaultModal/DepositVaultForm";
import {
  BaseDialogButtonWrapper,
  BaseDialogWrapper,
} from "@/components/Base/Dialog/StyledDialog";
import {
  BaseWarningBox,
  BaseErrorBox,
} from "@/components/Base/Boxes/StyledBoxes";
import VaultModalLockingBar from "@/components/Vaults/List/DepositVaultModal/VaultModalLockingBar";

export type VaultDepositProps = {
  vaultItemData: IVault;
  isTfVaultType: boolean;
  isUserKycPassed: boolean;
  tfVaultDepositEndDate: string | null;
  tfVaultLockEndDate: string | null;
  activeTfPeriod: number;
  minimumDeposit: number;
  onClose: () => void;
};

const VaultListItemDepositModal: FC<VaultDepositProps> = ({
  vaultItemData,
  isTfVaultType,
  isUserKycPassed,
  tfVaultDepositEndDate,
  tfVaultLockEndDate,
  activeTfPeriod,
  minimumDeposit,
  onClose,
}) => {
  const {
    methods,
    control,
    deposit,
    sharedToken,
    walletBalance,
    isWalletFetching,
    openDepositLoading,
    errors,
    setMax,
    validateMaxDepositValue,
    depositLimitExceeded,
    handleSubmit,
    onSubmit,
  } = useVaultOpenDeposit(vaultItemData, onClose);

  const { connected } = useWallet();

  return (
    <BaseDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      data-testid="vault-listItemDepositModal"
    >
      <BaseDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        sx={{ padding: "24px !important" }}
        sxCloseIcon={{ right: "16px", top: "16px" }}
      >
        Deposit
      </BaseDialogTitle>

      <DialogContent>
        <FormProvider {...methods}>
          <Box>
            {isTfVaultType && (
              <VaultModalLockingBar
                tfVaultLockEndDate={tfVaultLockEndDate}
                tfVaultDepositEndDate={tfVaultDepositEndDate}
                activeTfPeriod={activeTfPeriod}
              />
            )}
            <DepositVaultForm
              vaultItemData={vaultItemData}
              walletBalance={walletBalance}
              control={control}
              setMax={setMax}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              validateMaxDepositValue={validateMaxDepositValue}
              minimumDeposit={minimumDeposit}
              depositLimitExceeded={depositLimitExceeded}
            />
            <DepositVaultInfo
              vaultItemData={vaultItemData}
              deposit={deposit}
              sharedToken={sharedToken}
            />
            {isWalletFetching &&
              (BigNumber(walletBalance)
                .dividedBy(10 ** vaultItemData.token.decimals)
                .isLessThan(BigNumber(deposit)) ||
                walletBalance == "0") && (
                <BaseErrorBox sx={{ marginBottom: 0 }}>
                  <BaseInfoIcon />
                  <Typography>
                    Wallet balance is not enough to deposit.
                  </Typography>
                </BaseErrorBox>
              )}

            {activeTfPeriod === 1 && (
              <BaseWarningBox>
                <BaseInfoIcon
                  sx={{ width: "20px", color: "#F5953D", height: "20px" }}
                />
                <Box flexDirection="column">
                  <Typography width="100%">
                    Deposit period has been completed.
                  </Typography>
                </Box>
              </BaseWarningBox>
            )}
          </Box>
          <BaseDialogButtonWrapper>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
            {!connected ? (
              <WalletConnectBtn />
            ) : (
              <Button
                variant="gradient"
                onClick={handleSubmit(onSubmit)}
                disabled={
                  openDepositLoading ||
                  !!Object.keys(errors).length ||
                  (isTfVaultType && !isUserKycPassed) ||
                  (isTfVaultType && activeTfPeriod > 0)
                }
              >
                {openDepositLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Deposit"
                )}
              </Button>
            )}
          </BaseDialogButtonWrapper>
        </FormProvider>
      </DialogContent>
    </BaseDialogWrapper>
  );
};

export default memo(VaultListItemDepositModal);
