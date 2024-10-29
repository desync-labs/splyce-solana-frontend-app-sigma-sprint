import { FC, memo, useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatHashShorten } from "utils/format";
import useVaultContext from "@/context/vaultDetail";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";

const StatusBarWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  background: #3a4f6a;
  margin-top: 24px;
  padding: 20px 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 10px 8px;
  }
`;

const StrategyName = styled("div")`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 10px;
    line-height: 15px;
  }
`;

const StatusBoxStyled = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  color: #8af075;
  font-size: 14px;
  font-weight: 600;
  background: rgba(79, 101, 140, 0.2);
  padding: 4px 8px;
  &.inactive {
    color: #df3838;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 10px;
  }
`;

//ToDo: Implement the StatusLabel component
export const StatusLabel: FC<{ strategyId?: string }> = memo(
  ({ strategyId }) => {
    const [isShutDown, setIsShutDown] = useState(false);
    const { vault } = useVaultContext();
    const { strategies } = vault;

    useEffect(() => {
      if (strategies) {
        const strategy = strategies.find(
          (strategy) => strategy.id === strategyId
        );
        if (strategy) {
          setIsShutDown(strategy.isShutdown as boolean);
        }
      }
    }, [strategyId, strategies]);

    return (
      <StatusBoxStyled className={isShutDown ? "inactive" : "active"}>
        {isShutDown ? (
          <CancelIcon sx={{ width: "16px", height: "16px" }} />
        ) : (
          <CheckCircleRoundedIcon sx={{ width: "16px", height: "16px" }} />
        )}
        {isShutDown ? "Inactive" : "Active"}
      </StatusBoxStyled>
    );
  }
);

type StrategyStatusBarProps = {
  strategyId: string;
  strategyName: string;
};

const StrategyStatusBar: FC<StrategyStatusBarProps> = ({
  strategyId,
  strategyName,
}) => {
  return (
    <StatusBarWrapper>
      <FlexBox sx={{ justifyContent: "flex-start", gap: "12px" }}>
        <StrategyName>{`${strategyName} (${formatHashShorten(
          strategyId
        )})`}</StrategyName>
        <StatusLabel strategyId={strategyId} />
      </FlexBox>
    </StatusBarWrapper>
  );
};

export default memo(StrategyStatusBar);
