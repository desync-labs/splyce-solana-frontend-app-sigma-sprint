import { Paper, styled } from "@mui/material";
import useVaultContext from "@/context/vaultDetail";
import { VaultInfoTabs } from "@/hooks/Vaults/useVaultDetail";
import VaultDetailInfoNav from "@/components/Vaults/Detail/Tabs/InfoNav";
import VaultDetailInfoTabAbout from "@/components/Vaults/Detail/Tabs/InfoTabAbout";
import VaultDetailInfoTabStrategies from "@/components/Vaults/Detail/Tabs/InfoTabStrategies";
import ManagementVaultMethodList from "@/components/Vaults/Detail/Managment/ManagementVaultMethodList";
import ManagementStrategiesMethodList from "@/components/Vaults/Detail/Managment/ManagementStrategiesMethodList";

const VaultDetailInfoPaper = styled(Paper)`
  overflow: hidden;
  margin-top: 12px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: relative;
    width: 100%;
  }
`;

export const TabContentWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #476182;
  padding: 24px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 20px;
    padding: 16px;
  }
`;

const VaultDetailInfoTabs = () => {
  const {
    vault,
    activeVaultInfoTab,
    isUserManager,
    managedStrategiesIds,
    vaultMethods,
    strategyMethods,
  } = useVaultContext();
  return (
    <VaultDetailInfoPaper>
      <VaultDetailInfoNav />
      {activeVaultInfoTab === VaultInfoTabs.ABOUT && (
        <VaultDetailInfoTabAbout />
      )}
      {activeVaultInfoTab === VaultInfoTabs.STRATEGIES && (
        <VaultDetailInfoTabStrategies />
      )}
      {isUserManager && (
        <ManagementVaultMethodList
          isShow={activeVaultInfoTab === VaultInfoTabs.MANAGEMENT_VAULT}
          vaultId={vault.id}
          vaultMethods={vaultMethods}
        />
      )}
      {managedStrategiesIds.length > 0 && (
        <ManagementStrategiesMethodList
          isShow={activeVaultInfoTab === VaultInfoTabs.MANAGEMENT_STRATEGY}
          strategyMethods={strategyMethods}
          strategiesIds={managedStrategiesIds}
        />
      )}
    </VaultDetailInfoPaper>
  );
};

export default VaultDetailInfoTabs;
