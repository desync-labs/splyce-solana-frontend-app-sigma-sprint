import { FC } from "react";
import { Box, StepContent, StepLabel, styled } from "@mui/material";
import { getPeriodInDays } from "@/utils/getPeriodInDays";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import BasePopover from "@/components/Base/Popover/BasePopover";
import { CustomSkeleton } from "@/components/Base/Skeletons/StyledSkeleton";
import {
  AppStep,
  AppStepper,
  LockWrapper,
  QontoStepIcon,
  StepContentCounter,
  StepLabelOptionalValue,
} from "@/components/Vaults/Detail/VaultLockingBar";
import { BaseDialogFormInfoWrapper } from "@/components/Base/Form/StyledForm";

const CustomPaper = styled(Box)`
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #1e2f4d;
  padding: 16px;
  margin-bottom: 20px;
`;

type VaultModalLockingBarProps = {
  activeTfPeriod: number;
  tfVaultDepositEndDate: string | null;
  tfVaultLockEndDate: string | null;
};

const VaultModalLockingBar: FC<VaultModalLockingBarProps> = ({
  activeTfPeriod,
  tfVaultDepositEndDate,
  tfVaultLockEndDate,
}) => {
  const steps = [
    {
      key: "deposit-time", // added key to the object
      label: (
        <LockWrapper>
          Deposit Time
          <BasePopover
            id={"deposit-time"}
            text={
              <>
                Deposit Time - the period when users are allowed to deposit and
                withdraw funds.
              </>
            }
            iconSize={"14px"}
          />
        </LockWrapper>
      ),
      date:
        tfVaultDepositEndDate === null
          ? tfVaultDepositEndDate
          : new Date(Number(tfVaultDepositEndDate) * 1000),
    },
    {
      key: "lock-time", // added key to the object
      label: (
        <LockWrapper>
          Lock Time (
          {getPeriodInDays(tfVaultDepositEndDate, tfVaultLockEndDate)} days)
          <BasePopover
            id={"lock-time"}
            text={
              <>
                Lock Time - the period of time when deposited funds are used to
                generate yield according to the strategy. <br />
                Users can’t withdraw and deposit any funds within this period.{" "}
                After the lock period ends, users can withdraw funds.
              </>
            }
            iconSize={"14px"}
          />
        </LockWrapper>
      ),
      date:
        tfVaultLockEndDate === null
          ? tfVaultLockEndDate
          : new Date(Number(tfVaultLockEndDate) * 1000),
    },
  ];
  return (
    <BaseDialogFormInfoWrapper mb={"8px"}>
      <AppStepper activeStep={activeTfPeriod} orientation="vertical">
        {steps.map((step, index) => (
          <AppStep key={step.key}>
            <FlexBox>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                optional={
                  index < activeTfPeriod ? (
                    <StepLabelOptionalValue>Completed</StepLabelOptionalValue>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {step.date === null ? (
                  <CustomSkeleton
                    animation={"wave"}
                    variant="rounded"
                    width={100}
                    height={20}
                  />
                ) : (
                  <StepContentCounter date={step.date} />
                )}
              </StepContent>
            </FlexBox>
          </AppStep>
        ))}
      </AppStepper>
    </BaseDialogFormInfoWrapper>
  );
};

export default VaultModalLockingBar;
