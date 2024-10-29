import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { Box, MenuItem, Select, styled, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import useVaultContext from "@/context/vaultDetail";
import { IVaultStrategy } from "@/utils/TempData";
import { strategyTitle } from "@/utils/Vaults/getStrategyTitleAndDescription";
import VaultStrategyItem from "@/components/Vaults/Detail/Tabs/VaultStrategyItem";
import { VaultStrategiesSkeleton } from "@/components/Base/Skeletons/VaultSkeletons";
import { TabContentWrapper } from "@/components/Vaults/Detail/Tabs/InfoTabs";

export const StrategySelectorLabel = styled(Typography)`
  color: #a9bad0;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.44px;
  text-transform: uppercase;
  padding-bottom: 4px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    text-transform: capitalize;
    margin-bottom: 10px;
  }
`;

export const StrategySelector = styled(Select)`
  border-radius: 8px;
  height: 48px;

  & .MuiSelect-select {
    height: 100% !important;
    font-size: 16px !important;
    color: #fff !important;
    border: 1px solid #3a4f6a;
    border-radius: 8px;
    background-color: #1f2632;
    box-sizing: border-box;
    padding: 10px 12px !important;
  }
`;

const NoStrategiesTitle = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 16px 8px 24px;
  }
`;

const InfoTabStrategies = () => {
  const {
    vault,
    vaultLoading,
    performanceFee,
    reports,
    historicalApr,
    isReportsLoaded,
  } = useVaultContext();
  const { strategies, balanceTokens, token } = vault;
  const router = useRouter();

  const [activeStrategy, setActiveStrategy] = useState<string>("");

  useEffect(() => {
    if (!strategies || !strategies.length) return;

    const strategyId = router.query.strategy as string;

    if (strategyId) {
      setActiveStrategy(strategyId);
    } else {
      setActiveStrategy(strategies[0].id);
    }
  }, [setActiveStrategy, strategies, router.query.strategy]);

  const handleChangeActiveStrategy = useCallback(
    (event: SelectChangeEvent) => {
      const strategyId = event.target.value as string;

      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, strategy: strategyId },
        },
        undefined,
        { shallow: true }
      );

      setActiveStrategy(strategyId);
    },
    [router, setActiveStrategy]
  );

  if (!vault?.strategies?.length && !vaultLoading) {
    return (
      <TabContentWrapper>
        <NoStrategiesTitle>Has no strategies yet</NoStrategiesTitle>
      </TabContentWrapper>
    );
  }

  return (
    <TabContentWrapper>
      {vaultLoading ? (
        <VaultStrategiesSkeleton />
      ) : (
        <>
          <Box>
            <StrategySelectorLabel>Select Strategy</StrategySelectorLabel>
            <StrategySelector
              value={activeStrategy}
              onChange={handleChangeActiveStrategy}
              fullWidth
            >
              {strategies.map((strategy: IVaultStrategy, index: number) => (
                <MenuItem key={strategy.id} value={strategy.id}>
                  {strategyTitle[strategy.id.toLowerCase()] ? (
                    strategyTitle[strategy.id.toLowerCase()]
                  ) : (
                    <>
                      tspUSD: Direct Incentive - Educational Strategy{" "}
                      {index + 1}
                    </>
                  )}
                </MenuItem>
              ))}
            </StrategySelector>
          </Box>
          {strategies.map((strategy: IVaultStrategy, index: number) => (
            <VaultStrategyItem
              vaultId={vault.id}
              strategyData={strategy}
              reports={reports[strategy.id] || []}
              historicalApr={historicalApr[strategy.id] || []}
              vaultBalanceTokens={balanceTokens}
              tokenName={token.name}
              index={index}
              isShow={activeStrategy === strategy.id}
              key={strategy.id}
              reportsLoading={!isReportsLoaded}
            />
          ))}
        </>
      )}
    </TabContentWrapper>
  );
};

export default memo(InfoTabStrategies);
