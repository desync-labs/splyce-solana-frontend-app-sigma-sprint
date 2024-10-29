import { FC, useState, SyntheticEvent, useMemo, memo, ReactNode } from "react";
import { Box, styled, Tab, Tabs, Typography } from "@mui/material";
import MethodListItem, {
  ReadeMethodIcon,
  WriteMethodIcon,
} from "@/components/Vaults/Detail/Managment/MethodListItem";
import { TabContentWrapper } from "@/components/Vaults/Detail/Tabs/InfoTabs";

export const ProgramMethodListWrapper = styled(Box)`
  padding: 0;

  &.hide {
    display: none;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 24px 0 0;
  }
`;

export const MethodTypesTabs = styled(Tabs)`
  border-bottom: 1px solid #3a4f6a;
  min-height: unset;
  margin: 0 24px;

  & .MuiTabs-flexContainer {
    gap: 36px;
  }

  & .MuiTabs-indicator {
    height: 2px;
  }

  & .MuiTab-root {
    min-height: unset;
    min-width: unset;
    color: #d1dae6;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    padding: 16px 0;

    & svg {
      margin-right: 12px;
    }

    &.Mui-selected {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    margin-top: 0;

    & .MuiTab-root {
      width: 50%;
    }
  }
`;

export const STATE_MUTABILITY_TRANSACTIONS = ["nonpayable", "payable"];

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export const MethodsTabPanel: FC<TabPanelProps> = memo(
  ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`method-tabpanel-${index}`}
        aria-labelledby={`method-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ pt: "24px" }}>{children}</Box>}
      </div>
    );
  }
);

export const a11yProps = (index: number) => {
  return {
    id: `method-tab-${index}`,
    "aria-controls": `method-tabpanel-${index}`,
  };
};

type VaultItemManagementProps = {
  isShow: boolean;
  vaultId: string;
  vaultMethods: any;
};

const ManagementVaultMethodList: FC<VaultItemManagementProps> = ({
  isShow,
  vaultId,
  vaultMethods,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ProgramMethodListWrapper className={isShow ? "showing" : "hide"}>
      <TabContentWrapper sx={{ paddingLeft: 0, paddingRight: 0 }}>
        {!vaultMethods.length ? (
          <Typography>Has no program methods yet</Typography>
        ) : (
          <>
            <MethodTypesTabs
              value={value}
              onChange={handleChange}
              aria-label="state mutability tabs"
            >
              <Tab
                label="Read Program"
                icon={
                  <ReadeMethodIcon
                    color={value === 0 ? "#BBFB5B" : "#d1dae6"}
                  />
                }
                iconPosition="start"
                {...a11yProps(0)}
              />
              <Tab
                label="Write Program"
                icon={
                  <WriteMethodIcon
                    color={value === 1 ? "#BBFB5B" : "#d1dae6"}
                  />
                }
                iconPosition="start"
                {...a11yProps(1)}
              />
            </MethodTypesTabs>
            <MethodsTabPanel value={value} index={0}>
              {useMemo(
                () =>
                  vaultMethods
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
                        contractAddress={vaultId}
                        index={index}
                      />
                    )),
                [vaultMethods]
              )}
            </MethodsTabPanel>
            <MethodsTabPanel value={value} index={1}>
              {useMemo(
                () =>
                  vaultMethods
                    .filter((method) =>
                      STATE_MUTABILITY_TRANSACTIONS.includes(
                        method.stateMutability
                      )
                    )
                    .map((method: any, index: number) => (
                      <MethodListItem
                        key={index}
                        method={method}
                        contractAddress={vaultId}
                        index={index}
                      />
                    )),
                [vaultMethods]
              )}
            </MethodsTabPanel>
          </>
        )}
      </TabContentWrapper>
    </ProgramMethodListWrapper>
  );
};

export default memo(ManagementVaultMethodList);
