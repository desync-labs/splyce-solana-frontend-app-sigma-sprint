export const getVaultIndex = (vaultId: string) => {
  if (vaultId.toLowerCase() === "11111111") {
    return 0;
  }
  if (vaultId.toLowerCase() === "Ahg1opVcGX".toLowerCase()) {
    return 1;
  }
  if (vaultId.toLowerCase() === "LQM2cdzDY3".toLowerCase()) {
    return 2;
  }
  if (vaultId.toLowerCase() === "W723RTUpoZ".toLowerCase()) {
    return 3;
  }
  return 0;
};
