import { memo, useEffect, useState } from "react";
import { Box, Paper, styled, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import useVaultContext from "@/context/vaultDetail";
import useSharedContext from "@/context/shared";
import { formatNumber } from "@/utils/format";
import BasePageStatsWrapper from "@/components/Base/PageStatsGrid/PageStatsWrapper";
import BasePageStatsItem from "@/components/Base/PageStatsGrid/PageStatsItem";
import { StatsValueSkeleton } from "@/components/Base/Skeletons/StyledSkeleton";

const VaultPositionTitle = styled(Typography)`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 12px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
  }
`;

const UsdValue = styled(Box)`
  color: #a9bad0;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;

const VaultPositionStats = () => {
  const {
    vault,
    vaultLoading,
    vaultPosition,
    vaultPositionLoading,
    balanceEarned,
    tfVaultDepositLimit,
    isTfVaultType,
  } = useVaultContext();

  const fxdPrice = 1;

  const { isMobile } = useSharedContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(vaultLoading || vaultPositionLoading);
    }, 300);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [vaultLoading, vaultPositionLoading, setIsLoading]);

  const getVaultDepositLimit = () => {
    // if (isTfVaultType) {
    //   return BigNumber.max(BigNumber(tfVaultDepositLimit).dividedBy(10 ** 9), 0)
    // } else {
    return BigNumber.max(
      BigNumber(vault?.depositLimit || 0)
        .minus(vault?.balanceTokens || 0)
        .dividedBy(10 ** vault?.token?.decimals)
        .toNumber(),
      0
    );
    //}
  };

  return (
    <Paper>
      <VaultPositionTitle variant="h1">Your Position</VaultPositionTitle>
      <BasePageStatsWrapper>
        <BasePageStatsItem
          title={"Total Deposited"}
          value={
            isLoading ? (
              <StatsValueSkeleton
                height={isMobile ? 40 : 42}
                width={"100%"}
                marginTop={isMobile ? "0" : "12px"}
              />
            ) : (
              <>
                {formatNumber(
                  BigNumber(vault?.balanceTokens || 0)
                    .dividedBy(10 ** vault?.token?.decimals)
                    .toNumber()
                ) +
                  " " +
                  vault?.token?.symbol}
                <UsdValue>
                  {"$" +
                    formatNumber(
                      BigNumber(vault?.balanceTokens || 0)
                        .multipliedBy(fxdPrice)
                        .dividedBy(10 ** vault?.token?.decimals)
                        .toNumber()
                    )}
                </UsdValue>
              </>
            )
          }
          xs={6}
          sm={6}
          md={4}
        />
        <BasePageStatsItem
          title={"Available"}
          value={
            isLoading ? (
              <StatsValueSkeleton
                height={isMobile ? 40 : 42}
                width={"100%"}
                marginTop={isMobile ? "0" : "12px"}
              />
            ) : (
              <>
                {formatNumber(getVaultDepositLimit().toNumber())}{" "}
                {vault?.token?.symbol}
                <UsdValue>
                  {"$" +
                    formatNumber(
                      getVaultDepositLimit().multipliedBy(fxdPrice).toNumber()
                    )}
                </UsdValue>
              </>
            )
          }
          xs={6}
          sm={6}
          md={4}
        />
        <BasePageStatsItem
          title={"Balance"}
          value={
            isLoading ? (
              <StatsValueSkeleton
                height={isMobile ? 40 : 42}
                width={"100%"}
                marginTop={isMobile ? "0" : "12px"}
              />
            ) : (
              <>
                {formatNumber(
                  BigNumber(vaultPosition?.balancePosition || 0)
                    .dividedBy(10 ** vault?.token?.decimals)
                    .toNumber()
                ) +
                  " " +
                  vault?.token?.symbol}
                <UsdValue>
                  {"$" +
                    formatNumber(
                      BigNumber(vaultPosition?.balancePosition || 0)
                        .multipliedBy(fxdPrice)
                        .dividedBy(10 ** vault?.token?.decimals)
                        .toNumber()
                    )}
                </UsdValue>
              </>
            )
          }
          xs={6}
          sm={6}
          md={2}
        />
        <BasePageStatsItem
          title={"Earned"}
          value={
            <>
              {isLoading || balanceEarned === -1 ? (
                <StatsValueSkeleton
                  height={isMobile ? 40 : 42}
                  width={"100%"}
                  marginTop={isMobile ? "0" : "12px"}
                />
              ) : BigNumber(balanceEarned).isGreaterThan(0) ? (
                <>
                  {formatNumber(Number(balanceEarned)) +
                    " " +
                    vault?.token?.symbol}
                  <UsdValue>
                    {"$" +
                      formatNumber(
                        BigNumber(balanceEarned || "0")
                          .multipliedBy(fxdPrice)
                          .toNumber()
                      )}
                  </UsdValue>
                </>
              ) : (
                <>
                  0 {vault?.token?.symbol}
                  <UsdValue>$0</UsdValue>
                </>
              )}
            </>
          }
          xs={6}
          sm={6}
          md={2}
        />
      </BasePageStatsWrapper>
    </Paper>
  );
};

export default memo(VaultPositionStats);
