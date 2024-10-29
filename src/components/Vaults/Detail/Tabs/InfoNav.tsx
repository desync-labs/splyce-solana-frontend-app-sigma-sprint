import { memo } from "react";
import { VaultInfoTabs } from "@/hooks/Vaults/useVaultDetail";
import useVaultContext from "@/context/vaultDetail";
import {
  BaseTabsItem,
  BaseTabsWrapper,
} from "@/components/Base/Tabs/StyledTabs";

const VaultDetailInfoNav = () => {
  const {
    activeVaultInfoTab,
    managedStrategiesIds,
    isUserManager,
    setActiveVaultInfoTabHandler,
  } = useVaultContext();

  return (
    <BaseTabsWrapper sx={{ marginBottom: "24px" }}>
      <BaseTabsItem
        onClick={() => setActiveVaultInfoTabHandler(VaultInfoTabs.ABOUT)}
        className={activeVaultInfoTab === VaultInfoTabs.ABOUT ? "active" : ""}
      >
        About
      </BaseTabsItem>
      <BaseTabsItem
        onClick={() => setActiveVaultInfoTabHandler(VaultInfoTabs.STRATEGIES)}
        className={
          activeVaultInfoTab === VaultInfoTabs.STRATEGIES ? "active" : ""
        }
      >
        Strategies
      </BaseTabsItem>
      {isUserManager && (
        <BaseTabsItem
          onClick={() =>
            setActiveVaultInfoTabHandler(VaultInfoTabs.MANAGEMENT_VAULT)
          }
          className={
            activeVaultInfoTab === VaultInfoTabs.MANAGEMENT_VAULT
              ? "active"
              : ""
          }
        >
          Vault Manager
        </BaseTabsItem>
      )}
      {managedStrategiesIds.length > 0 && (
        <BaseTabsItem
          onClick={() =>
            setActiveVaultInfoTabHandler(VaultInfoTabs.MANAGEMENT_STRATEGY)
          }
          className={
            activeVaultInfoTab === VaultInfoTabs.MANAGEMENT_STRATEGY
              ? "active"
              : ""
          }
        >
          Strategies Manager
        </BaseTabsItem>
      )}
    </BaseTabsWrapper>
  );
};

export default memo(VaultDetailInfoNav);
