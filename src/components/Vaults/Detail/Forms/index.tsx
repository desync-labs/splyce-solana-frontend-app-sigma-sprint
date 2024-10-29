import { useEffect, useState } from "react";
import { styled, Paper, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import useVaultContext from "@/context/vaultDetail";
import useSharedContext from "@/context/shared";

import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import { CustomSkeleton } from "@/components/Base/Skeletons/StyledSkeleton";
import VaultDetailDepositForm from "@/components/Vaults/Detail/Forms/DepositForm";
import VaultDetailManageForm from "@/components/Vaults/Detail/Forms/ManageForm";

const VaultDepositPaper = styled(Paper)`
  margin-top: 12px;
  padding: 16px 24px 24px;
`;

export const VaultFormWrapper = styled(FlexBox)`
  align-items: stretch;
  gap: 20px;
  padding-top: 12px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    padding-top: 10px;
  }
`;

const VaultDetailForms = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {
    vaultPosition,
    isTfVaultType,
    activeTfPeriod,
    shutdown,
    vaultLoading,
    vaultPositionLoading,
  } = useVaultContext();
  const { isMobile } = useSharedContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(vaultPosition && !vaultPositionLoading && !vaultLoading);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [vaultPosition, vaultPositionLoading, vaultLoading, setIsLoaded]);

  if (isTfVaultType && activeTfPeriod > 0) return null;

  if (!isLoaded) {
    return (
      <VaultDepositPaper>
        <Typography variant="h3" sx={{ fontSize: isMobile ? "14px" : "16px" }}>
          Deposit
        </Typography>
        <VaultFormWrapper>
          <CustomSkeleton
            variant="rounded"
            width={"100%"}
            height={isMobile ? 200 : 222}
            animation={"wave"}
          />
          <CustomSkeleton
            variant="rounded"
            width={"100%"}
            height={isMobile ? 211 : 222}
            animation={"wave"}
          />
        </VaultFormWrapper>
      </VaultDepositPaper>
    );
  }

  return (
    <VaultDepositPaper>
      {isLoaded && BigNumber(vaultPosition.balanceShares).isGreaterThan(0) ? (
        <VaultDetailManageForm />
      ) : !shutdown ? (
        <VaultDetailDepositForm />
      ) : null}
    </VaultDepositPaper>
  );
};

export default VaultDetailForms;
