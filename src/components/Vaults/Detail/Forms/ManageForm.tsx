import { memo } from "react";
import { FormProvider } from "react-hook-form";
import { styled } from "@mui/material";
import useVaultManageDeposit, {
  FormType,
} from "@/hooks/Vaults/useVaultManageDeposit";
import useVaultContext from "@/context/vaultDetail";
import ManageVaultForm from "@/components/Vaults/List/ManageVaultModal/ManageVaultForm";
import ManageVaultInfo from "@/components/Vaults/Detail/Forms/ManageVaultInfo";
import {
  BaseDialogNavItem,
  BaseDialogNavWrapper,
} from "@/components/Base/Dialog/StyledDialog";
import { VaultFormWrapper } from "@/components/Vaults/Detail/Forms/index";
import { VaultDetailFormColumn } from "@/components/Vaults/Detail/Forms/DepositForm";

const NavWrapper = styled(BaseDialogNavWrapper)`
  gap: 24px;
  margin-top: 0;
`;

const NavItem = styled(BaseDialogNavItem)`
  font-size: 16px;
  padding: 6px 0;
`;

const VaultDetailManageForm = () => {
  const { vault, vaultPosition, balanceToken, minimumDeposit } =
    useVaultContext();
  const { shutdown } = vault;

  const onClose = () => {
    methods.reset();
  };

  const {
    formType,
    setFormType,
    isWalletFetching,
    walletBalance,
    control,
    formToken,
    formSharedToken,
    approveBtn,
    approvalPending,
    openDepositLoading,
    errors,
    approve,
    setMax,
    validateMaxValue,
    handleSubmit,
    onSubmit,
    methods,
    withdrawLimitExceeded,
    depositLimitExceeded,
  } = useVaultManageDeposit(vault, vaultPosition, minimumDeposit, onClose);

  return (
    <>
      <NavWrapper>
        {!shutdown && (
          <NavItem
            className={formType === FormType.DEPOSIT ? "active" : ""}
            onClick={() => setFormType(FormType.DEPOSIT)}
          >
            Deposit
          </NavItem>
        )}
        <NavItem
          className={formType === FormType.WITHDRAW ? "active" : ""}
          onClick={() => setFormType(FormType.WITHDRAW)}
        >
          Withdraw
        </NavItem>
      </NavWrapper>
      <VaultFormWrapper>
        <FormProvider {...methods}>
          <VaultDetailFormColumn>
            <ManageVaultForm
              vaultItemData={vault}
              balanceToken={balanceToken}
              walletBalance={walletBalance}
              control={control}
              formType={formType}
              setMax={setMax}
              validateMaxValue={validateMaxValue}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              vaultPosition={vaultPosition}
              depositLimitExceeded={depositLimitExceeded}
              isDetailPage={true}
            />
          </VaultDetailFormColumn>
          <ManageVaultInfo
            formType={formType}
            vaultItemData={vault}
            vaultPosition={vaultPosition}
            formToken={formToken}
            formSharedToken={formSharedToken}
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
            withdrawLimitExceeded={withdrawLimitExceeded}
          />
        </FormProvider>
      </VaultFormWrapper>
    </>
  );
};

export default memo(VaultDetailManageForm);
