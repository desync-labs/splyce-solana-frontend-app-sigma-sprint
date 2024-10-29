import { Grid } from "@mui/material";
import VaultLockingBar from "@/components/Vaults/Detail/VaultLockingBar";
import VaultProfitCalculator from "@/components/Vaults/Detail/VaultProfitCalculator";
import useVaultContext from "@/context/vaultDetail";

const VaultLockCalculatorBlock = () => {
  const { isTfVaultType } = useVaultContext();
  return (
    <Grid container spacing={2} pt="12px" alignItems="stretch">
      {isTfVaultType && (
        <Grid item xs={12} sm={6}>
          <VaultLockingBar />
        </Grid>
      )}
      <Grid item xs={12} sm={isTfVaultType ? 6 : 12}>
        <VaultProfitCalculator />
      </Grid>
    </Grid>
  );
};

export default VaultLockCalculatorBlock;
