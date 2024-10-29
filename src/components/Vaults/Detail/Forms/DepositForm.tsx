import { memo } from "react";
import { FormProvider } from "react-hook-form";
import { Box, styled, Typography } from "@mui/material";
import useVaultContext from "@/context/vaultDetail";
import useSharedContext from "@/context/shared";
import useVaultOpenDeposit from "@/hooks/Vaults/useVaultOpenDeposit";

import DepositVaultForm from "@/components/Vaults/List/DepositVaultModal/DepositVaultForm";
import DepositVaultInfo from "@/components/Vaults/Detail/Forms/DepositVaultInfo";
import { VaultFormWrapper } from "@/components/Vaults/Detail/Forms/index";

export const VaultDetailFormColumn = styled(Box)`
  width: 50%;
  height: 100%;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

const VaultDetailDepositForm = () => {
  const { vault, minimumDeposit } = useVaultContext();
  const { isMobile } = useSharedContext();

  const onClose = () => {
    methods.reset();
  };

  const {
    methods,
    walletBalance,
    isWalletFetching,
    control,
    deposit,
    sharedToken,
    approveBtn,
    approvalPending,
    openDepositLoading,
    errors,
    approve,
    setMax,
    validateMaxDepositValue,
    depositLimitExceeded,
    handleSubmit,
    onSubmit,
  } = useVaultOpenDeposit(vault, onClose);

  return (
    <>
      <Typography variant="h3" sx={{ fontSize: isMobile ? "14px" : "16px" }}>
        Deposit
      </Typography>
      <VaultFormWrapper>
        <FormProvider {...methods}>
          <VaultDetailFormColumn>
            <DepositVaultForm
              vaultItemData={vault}
              walletBalance={walletBalance}
              control={control}
              setMax={setMax}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              validateMaxDepositValue={validateMaxDepositValue}
              minimumDeposit={minimumDeposit}
              depositLimitExceeded={depositLimitExceeded}
              isDetailPage={true}
            />
          </VaultDetailFormColumn>
          <DepositVaultInfo
            vaultItemData={vault}
            deposit={deposit}
            sharedToken={sharedToken}
            isWalletFetching={isWalletFetching}
            walletBalance={walletBalance}
            onClose={onClose}
            openDepositLoading={openDepositLoading}
            errors={errors}
            approveBtn={approveBtn}
            approve={approve}
            approvalPending={approvalPending}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </FormProvider>
      </VaultFormWrapper>
    </>
  );
};

export default memo(VaultDetailDepositForm);
