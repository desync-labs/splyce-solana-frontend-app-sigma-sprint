import { formatNumber } from "utils/format";
import { ApyConfig } from "utils/Vaults/getApyConfig";
import { IVault } from "@/utils/TempData";

const useApr = (vault: IVault) => {
  if (ApyConfig[vault?.id?.toLowerCase()]) {
    return formatNumber(ApyConfig[vault?.id?.toLowerCase()]);
  }

  return formatNumber(Number(vault.apr));
};

const useAprNumber = (vault: IVault) => {
  if (ApyConfig[vault?.id?.toLowerCase()]) {
    return ApyConfig[vault?.id?.toLowerCase()];
  }

  return Number(vault.apr);
};

const getApr = (currentDept: string, apr: string, vaultId: string) => {
  if (ApyConfig[vaultId.toLowerCase()]) {
    return ApyConfig[vaultId.toLowerCase()].toString();
  }

  return apr;
};

export { useApr, useAprNumber, getApr };
