import { FC, memo } from "react";
import Image from "next/image";
import { Box, styled } from "@mui/material";
import BigNumber from "bignumber.js";
import { formatNumber } from "@/utils/format";
import useSharedContext from "@/context/shared";
import useTotalStats from "@/hooks/Vaults/useTotalStats";
import { BaseSkeletonValue } from "@/components/Base/Skeletons/StyledSkeleton";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";

import DepositedIcon from "@/assets/svg/icons/vault-stats-deposited.svg";
import EarnedIcon from "@/assets/svg/icons/vault-stats-earning.svg";

const StatsWrapper = styled(FlexBox)`
  gap: 16px;
  margin: 36px 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 4px;
    margin: 20px 0;
  }
`;

const StatItemWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
  border-radius: 12px;
  background: ${({ theme }) => theme.palette.background.paper};
  padding: 16px 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 50%;
    & img {
      width: 24px;
      height: 24px;
    }
  }
`;

const StatItemInfo = styled(FlexBox)`
  gap: 12px;
  justify-content: flex-start;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    width: fit-content;

    & img {
      margin-left: -4px;
    }
  }
`;
const StatItemLabel = styled(Box)`
  color: #a9bad0;
  font-size: 20px;
  font-weight: 600;
  line-height: 16px;
  text-transform: capitalize;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

const StatItemValue = styled(Box)`
  color: #fff;
  text-align: right;
  font-size: 24px;
  font-weight: 600;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

type VaultsTotalStatsType = {
  positionsList: any[];
  positionsLoading: boolean;
};

type StatItemPropsType = {
  title: string;
  value: string;
  icon: string;
  isLoading: boolean;
};

const StatItem: FC<StatItemPropsType> = memo(
  ({ title, value, icon, isLoading }) => {
    const fxdPrice = 1;
    const fetchPricesInProgress = false;
    const { isMobile } = useSharedContext();
    return (
      <StatItemWrapper>
        <StatItemInfo>
          <Image src={icon} alt={title} width={36} height={36} />
          <StatItemLabel>{title}</StatItemLabel>
        </StatItemInfo>
        <StatItemValue>
          {value === "-1" || isLoading || fetchPricesInProgress ? (
            <BaseSkeletonValue
              animation={"wave"}
              width={isMobile ? 80 : 110}
              height={isMobile ? 24 : 28}
            />
          ) : BigNumber(value).isGreaterThan(0) ? (
            `$${formatNumber(
              BigNumber(value).multipliedBy(fxdPrice).toNumber()
            )}`
          ) : (
            "$0"
          )}
        </StatItemValue>
      </StatItemWrapper>
    );
  }
);

const VaultsTotalStats: FC<VaultsTotalStatsType> = ({
  positionsList,
  positionsLoading,
}) => {
  const { totalBalance, balanceEarned } = useTotalStats(
    positionsList,
    positionsLoading
  );

  return (
    <StatsWrapper>
      <StatItem
        title="Deposited"
        value={totalBalance}
        icon={DepositedIcon as string}
        isLoading={positionsLoading}
      />
      <StatItem
        title="Earnings"
        value={balanceEarned}
        icon={EarnedIcon as string}
        isLoading={positionsLoading}
      />
    </StatsWrapper>
  );
};

export default memo(VaultsTotalStats);
