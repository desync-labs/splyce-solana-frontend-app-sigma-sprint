import { FC, memo, SyntheticEvent, useMemo, useState } from "react";
import { Box, Divider, MenuItem, styled, Tab, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import { strategyTitle } from "@/utils/Vaults/getStrategyTitleAndDescription";
import { formatHashShorten } from "@/utils/format";
import {
  a11yProps,
  ProgramMethodListWrapper,
  MethodsTabPanel,
  MethodTypesTabs,
  STATE_MUTABILITY_TRANSACTIONS,
} from "@/components/Vaults/Detail/Managment/ManagementVaultMethodList";
import MethodListItem, {
  ReadeMethodIcon,
  WriteMethodIcon,
} from "@/components/Vaults/Detail/Managment/MethodListItem";
import StrategyStatusBar from "@/components/Vaults/Detail/Managment/StrategyStatusBar";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import { TabContentWrapper } from "@/components/Vaults/Detail/Tabs/InfoTabs";
import {
  StrategySelector,
  StrategySelectorLabel,
} from "@/components/Vaults/Detail/Tabs/InfoTabStrategies";

const StrategyManagerDescription = styled("div")`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.14px;
  padding-bottom: 48px;

  & a {
    color: #8ea4cc;
    text-decoration-line: underline;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
  }
`;

const StrategyManagerDescriptionDivider = styled(Divider)`
  display: none;
  border-color: #3d5580;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: block;
    padding-top: 20px;
  }
`;

type ManagementStrategiesMethodListProps = {
  isShow: boolean;
  strategiesIds: string[];
  strategyMethods: any[];
};

const ManagementStrategiesMethodTabsStyled = styled(Box)`
  margin-top: 20px;
`;

const ManagementStrategiesMethodTabs: FC<{
  strategyMethods: any[];
  currentStrategyId: string;
}> = memo(({ strategyMethods, currentStrategyId }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return !strategyMethods.length ? (
    <Typography px="24px">Has no program methods yet</Typography>
  ) : (
    <ManagementStrategiesMethodTabsStyled>
      <MethodTypesTabs
        value={value}
        onChange={handleChange}
        aria-label="state mutability tabs"
      >
        <Tab
          label="Read Program"
          icon={<ReadeMethodIcon color={value === 0 ? "#BBFB5B" : "#d1dae6"} />}
          iconPosition="start"
          {...a11yProps(0)}
        />
        <Tab
          label="Write Program"
          icon={<WriteMethodIcon color={value === 1 ? "#BBFB5B" : "#d1dae6"} />}
          iconPosition="start"
          {...a11yProps(1)}
        />
      </MethodTypesTabs>
      <MethodsTabPanel value={value} index={0}>
        {useMemo(
          () =>
            strategyMethods
              .filter(
                (method) =>
                  !STATE_MUTABILITY_TRANSACTIONS.includes(
                    method.stateMutability
                  )
              )
              .map((method: any, index: number) => (
                <MethodListItem
                  key={index}
                  method={method}
                  contractAddress={currentStrategyId}
                  index={index}
                />
              )),
          [strategyMethods]
        )}
      </MethodsTabPanel>
      <MethodsTabPanel value={value} index={1}>
        {useMemo(
          () =>
            strategyMethods
              .filter((method) =>
                STATE_MUTABILITY_TRANSACTIONS.includes(method.stateMutability)
              )
              .map((method: any, index: number) => (
                <MethodListItem
                  key={index}
                  method={method}
                  contractAddress={currentStrategyId}
                  index={index}
                />
              )),
          [strategyMethods]
        )}
      </MethodsTabPanel>
    </ManagementStrategiesMethodTabsStyled>
  );
});

const ManagementStrategiesMethodList: FC<
  ManagementStrategiesMethodListProps
> = ({ isShow, strategiesIds, strategyMethods }) => {
  const [currentStrategyId, setCurrentStrategyId] = useState<string>(
    strategiesIds[0]
  );
  const [currentStrategyName, setCurrentStrategyName] = useState<string>(
    strategyTitle[strategiesIds[0].toLowerCase()] ||
      `SPLY: Direct Incentive - Educational Strategy 1`
  );

  const handleStrategyChange = (event: SelectChangeEvent<unknown>) => {
    const { value } = event.target as HTMLInputElement;
    setCurrentStrategyId(value as string);

    const index = strategiesIds.findIndex((id) => id === value);
    setCurrentStrategyName(
      strategyTitle[value.toLowerCase()] ||
        `SPLY: Direct Incentive - Educational Strategy ${index + 1}`
    );
  };

  return (
    <ProgramMethodListWrapper className={isShow ? "showing" : "hide"}>
      <TabContentWrapper sx={{ paddingLeft: 0, paddingRight: 0 }}>
        {strategiesIds?.length && (
          <Box px={"24px"}>
            <StrategyManagerDescription>
              The strategy manager for a vault is responsible for overseeing and
              managing various investment strategies within the vault. This
              includes monitoring performance, adjusting parameters, and
              ensuring optimal execution of the strategies to achieve the
              desired financial outcomes. <a href="#">Learn More</a>
            </StrategyManagerDescription>
            <StrategyManagerDescriptionDivider />
            <StrategySelectorLabel>Select Strategy</StrategySelectorLabel>
            <StrategySelector
              fullWidth
              value={currentStrategyId}
              onChange={handleStrategyChange}
            >
              {strategiesIds.map((id, index) => (
                <MenuItem key={id} value={id}>
                  {strategyTitle[id.toLowerCase()] ? (
                    strategyTitle[id.toLowerCase()]
                  ) : (
                    <>
                      FXD: Direct Incentive - Educational Strategy {index + 1}
                    </>
                  )}{" "}
                  {`(${formatHashShorten(id)})`}
                </MenuItem>
              ))}
            </StrategySelector>
            <StrategyStatusBar
              strategyId={currentStrategyId}
              strategyName={currentStrategyName}
            />
          </Box>
        )}
        <ManagementStrategiesMethodTabs
          strategyMethods={strategyMethods}
          currentStrategyId={currentStrategyId}
        />
      </TabContentWrapper>
    </ProgramMethodListWrapper>
  );
};

export default memo(ManagementStrategiesMethodList);
