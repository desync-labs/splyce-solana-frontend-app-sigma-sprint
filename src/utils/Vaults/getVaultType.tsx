import { VaultType } from "@/utils/TempData";

const vaultType: { [key: string]: VaultType } = {};

if (process.env.NEXT_PUBLIC_ENV === "prod") {
  vaultType["Ahg1opVcGX".toLowerCase()] = VaultType.DEFI;
  vaultType["LQM2cdzDY3".toLowerCase()] = VaultType.TRADEFI;
  vaultType["W723RTUpoZ".toLowerCase()] = VaultType.CROSSCHAIN;
} else {
  vaultType["Ahg1opVcGX".toLowerCase()] = VaultType.DEFI;
  vaultType["LQM2cdzDY3".toLowerCase()] = VaultType.TRADEFI;
  vaultType["W723RTUpoZ".toLowerCase()] = VaultType.TRADEFI;
}

export { vaultType };
