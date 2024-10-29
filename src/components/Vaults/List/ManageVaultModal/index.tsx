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

import useVaultManageDeposit, {
  FormType,
} from "@/hooks/Vaults/useVaultManageDeposit";
import { IVault, IVaultPosition } from "@/utils/TempData";

import ManageVaultForm from "@/components/Vaults/List/ManageVaultModal/ManageVaultForm";
import ManageVaultInfo from "@/components/Vaults/List/ManageVaultModal/ManageVaultInfo";
import VaultModalLockingBar from "@/components/Vaults/List/DepositVaultModal/VaultModalLockingBar";
import {
  BaseDialogButtonWrapper,
  BaseDialogNavItem,
  BaseDialogNavWrapper,
  BaseDialogWrapper,
} from "@/components/Base/Dialog/StyledDialog";
import {
  BaseErrorBox,
  BaseWarningBox,
} from "@/components/Base/Boxes/StyledBoxes";
import { BaseDialogTitle } from "@/components/Base/Dialog/BaseDialogTitle";
import WalletConnectBtn from "@/components/Base/WalletConnectBtn";
import { BaseInfoIcon } from "@/components/Base/Icons/StyledIcons";

export type VaultManageProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  isTfVaultType: boolean;
  tfVaultDepositEndDate: string | null;
  tfVaultLockEndDate: string | null;
  activeTfPeriod: number;
  minimumDeposit: number;
  onClose: () => void;
};

const VaultListItemManageModal: FC<VaultManageProps> = ({
  vaultItemData,
  vaultPosition,
  isTfVaultType,
  tfVaultDepositEndDate,
  tfVaultLockEndDate,
  activeTfPeriod,
  minimumDeposit,
  onClose,
}) => {
  const {
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
    validateMaxValue,
    setMax,
    handleSubmit,
    onSubmit,
    methods,
    withdrawLimitExceeded,
  } = useVaultManageDeposit(
    vaultItemData,
    vaultPosition,
    minimumDeposit,
    onClose
  );

  const { connected } = useWallet();
  const { shutdown } = vaultItemData;

  return (
    <BaseDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      data-testid="vault-listItemManageModal"
    >
      <BaseDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        sx={{ padding: "24px" }}
        sxCloseIcon={{ right: "16px", top: "16px" }}
      >
        {shutdown ? (
          "Withdrawing"
        ) : (
          <BaseDialogNavWrapper>
            <BaseDialogNavItem
              onClick={() => setFormType(FormType.DEPOSIT)}
              className={formType === FormType.DEPOSIT ? "active" : ""}
              data-testid="vault-listItemManageModal-depositNavItem"
            >
              Deposit
            </BaseDialogNavItem>
            <BaseDialogNavItem
              onClick={() => setFormType(FormType.WITHDRAW)}
              className={formType === FormType.WITHDRAW ? "active" : ""}
              data-testid="vault-listItemManageModal-withdrawNavItem"
            >
              Withdraw
            </BaseDialogNavItem>
          </BaseDialogNavWrapper>
        )}
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

            <ManageVaultForm
              balanceToken={balancePosition}
              vaultItemData={vaultItemData}
              vaultPosition={vaultPosition}
              walletBalance={walletBalance}
              control={control}
              formType={formType}
              setMax={setMax}
              validateMaxValue={validateMaxValue}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            />
            <ManageVaultInfo
              formType={formType}
              vaultItemData={vaultItemData}
              vaultPosition={vaultPosition}
              formToken={formToken}
              formSharedToken={formSharedToken}
            />
            {isWalletFetching &&
              formType === FormType.DEPOSIT &&
              (BigNumber(walletBalance)
                .dividedBy(10 ** vaultItemData.token.decimals)
                .isLessThan(BigNumber(formToken)) ||
                walletBalance == "0") && (
                <BaseErrorBox sx={{ marginBottom: 0 }}>
                  <BaseInfoIcon />
                  <Typography>
                    Wallet balance is not enough to deposit.
                  </Typography>
                </BaseErrorBox>
              )}
            {formType === FormType.WITHDRAW &&
              withdrawLimitExceeded(formToken) && (
                <BaseErrorBox sx={{ marginBottom: 0 }}>
                  <BaseInfoIcon />
                  <Typography>{withdrawLimitExceeded(formToken)}</Typography>
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
                  (isTfVaultType && activeTfPeriod > 0) ||
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
        </FormProvider>
      </DialogContent>
    </BaseDialogWrapper>
  );
};

export default memo(VaultListItemManageModal);
