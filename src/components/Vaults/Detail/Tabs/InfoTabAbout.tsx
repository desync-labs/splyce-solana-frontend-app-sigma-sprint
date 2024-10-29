import { memo, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Box, List, styled } from "@mui/material";
import { IVaultStrategyReport, VaultType } from "@/utils/TempData";
import useVaultContext from "@/context/vaultDetail";
import VaultHistoryChart, {
  HistoryChartDataType,
} from "@/components/Vaults/Detail/VaultHistoryChart";
import VaultAboutTabContent from "@/components/Vaults/Detail/Tabs/AboutTabContent";
import { VaultAboutSkeleton } from "@/components/Base/Skeletons/VaultSkeletons";
import { TabContentWrapper } from "@/components/Vaults/Detail/Tabs/InfoTabs";
import { tempEarnedData } from "@/utils/TempEarnedData";

export const VaultDescriptionWrapper = styled(Box)`
  font-size: 14px;
  font-weight: 400;
  color: #d1dae6;

  span {
    font-size: 14px;
    font-weight: 400;
    color: #d1dae6;
  }

  ul {
    list-style: none;
    padding: 0;
    strong {
      font-weight: 600;
      font-size: 14px;
      text-decoration-line: underline;
    }
    li {
      margin-bottom: 12px;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
    span {
      font-size: 12px;
    }
  }
`;

export const VaultContractAddress = styled(Box)`
  font-size: 14px;
  color: #d1dae6;
  border-bottom: 1px solid #476182;
  padding-bottom: 12px;
  a {
    color: #d1dae6;
    text-decoration: underline;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

export const AppListApy = styled(List)`
  &.MuiList-root {
    display: flex;
    flex-direction: row;
    gap: 100px;
    justify-content: flex-start;
    border-bottom: 1px solid #476182;
    padding: 4px 0 12px 0;
  }
  & li.MuiListItem-root {
    flex-direction: column;
    align-items: flex-start;
    width: fit-content;
    padding: 0;

    & .MuiListItemText-root span {
      color: #a9bad0;
      font-size: 13px;
      font-weight: 600;
      line-height: 16px;
      letter-spacing: 0.5px;
    }
    & .MuiListItemSecondaryAction-root {
      font-weight: 600;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    &.MuiList-root {
      flex-direction: column;
      gap: 8px;
    }
    & li.MuiListItem-root {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }
  }
`;

export const AppListFees = styled(AppListApy)``;

const InfoTabAbout = () => {
  const {
    vault,
    reports,
    historicalApr,
    vaultLoading,
    isReportsLoaded,
    activeTfPeriod,
  } = useVaultContext();
  const [earnedHistoryArr, setEarnedHistoryArr] = useState<
    HistoryChartDataType[]
  >([]);
  const { type } = vault;

  useEffect(() => {
    if (!Object.keys(reports).length) {
      return;
    }

    const extractedData = [];
    let allReports: IVaultStrategyReport[] = [];
    let accumulatedTotalEarned = "0";

    for (const reportsCollection of Object.values(reports)) {
      allReports = [...allReports, ...reportsCollection];
    }

    allReports.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    for (let i = 0; i <= allReports.length - 1; i++) {
      const report = allReports[i];

      const currentTotalEarned = BigNumber(report.gain)
        .minus(report.loss)
        .dividedBy(10 ** vault.token.decimals)
        .plus(accumulatedTotalEarned)
        .toString();

      accumulatedTotalEarned = currentTotalEarned;

      extractedData.push({
        timestamp: report.timestamp,
        chartValue: currentTotalEarned,
      });
    }

    setEarnedHistoryArr(extractedData);
  }, [reports, historicalApr]);

  return (
    <TabContentWrapper>
      {vaultLoading || !vault.id ? (
        <VaultAboutSkeleton />
      ) : (
        <VaultAboutTabContent />
      )}
      {type === VaultType.TRADEFI && activeTfPeriod === 0 ? null : (
        <VaultHistoryChart
          title={
            type === VaultType.TRADEFI && activeTfPeriod < 2
              ? "Expected Cumulative Earnings"
              : "Cumulative Earnings"
          }
          chartDataArray={tempEarnedData}
          valueLabel="Earnings"
          valueUnits={` ${vault?.token?.name}`}
          isLoading={!isReportsLoaded}
        />
      )}
    </TabContentWrapper>
  );
};

export default memo(InfoTabAbout);
