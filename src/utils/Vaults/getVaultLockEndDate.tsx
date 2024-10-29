const TF_VAULT_ADDITIONS_LOCKED_DAYS = 0;

const getVaultLockEndDate = (date: string) => {
  const result = new Date(Number(date) * 1000);
  result.setDate(result.getDate() + Number(TF_VAULT_ADDITIONS_LOCKED_DAYS));
  return result.getTime() / 1000;
};

export { getVaultLockEndDate };
