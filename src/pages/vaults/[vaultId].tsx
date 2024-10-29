import { VaultProvider } from "@/context/vaultDetail";
import { VaultBreadcrumbs } from "@/components/Base/Breadcrumbs/StyledBreadcrumbs";
import VaultPositionStats from "@/components/Vaults/Detail/VaultPositionStats";
import VaultDetailForm from "@/components/Vaults/Detail/Forms";
import VaultDetailInfoTabs from "@/components/Vaults/Detail/Tabs/InfoTabs";
import VaultLockCalculatorBlock from "@/components/Vaults/Detail/VaultLockCalculatorBlock";
import PageContainer from "@/components/Base/PageContainer";

const VaultDetailPage = () => {
  return (
    <VaultProvider>
      <PageContainer>
        <VaultBreadcrumbs />
        <VaultPositionStats />
        <VaultLockCalculatorBlock />
        <VaultDetailForm />
        <VaultDetailInfoTabs />
      </PageContainer>
    </VaultProvider>
  );
};

export default VaultDetailPage;
