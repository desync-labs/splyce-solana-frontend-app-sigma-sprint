import { ChangeEvent, memo, useState } from "react";
import Image from "next/image";
import BigNumber from "bignumber.js";
import { Box, Paper, styled, Typography } from "@mui/material";

import useVaultContext from "@/context/vaultDetail";
import { formatNumber } from "@/utils/format";
import { getTokenLogoURL } from "@/utils/tokenLogo";
import { getPeriodInDays } from "@/utils/getPeriodInDays";
import { useAprNumber } from "@/hooks/Vaults/useApr";
import { CustomSkeleton } from "@/components/Base/Skeletons/StyledSkeleton";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import { BaseInfoIcon } from "@/components/Base/Icons/StyledIcons";
import {
  BaseFormInputErrorWrapper,
  BaseFormInputLabel,
  BaseFormInputUsdIndicator,
  BaseFormInputWrapper,
  BaseFormLabelRow,
  BaseTextField,
} from "@/components/Base/Form/StyledForm";

const SummaryWrapper = styled(FlexBox)`
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const CalculatorInputWrapper = styled(BaseFormInputWrapper)`
  width: 100%;
  margin-bottom: 0;
`;

const CalculatorTextField = styled(BaseTextField)`
  input,
  textarea {
    height: 30px;
    background: #1f2632;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    border: 1px solid #3a4f6a;
    padding: 8px 8px 8px 121px;

    &:disabled {
      height: 30px;
      border: 1px solid #476182;
      -webkit-text-fill-color: #3da329;
      padding: 8px;

      &:hover,
      &:focus {
        box-shadow: unset;
      }
    }
  }
`;

const CalculatorUsdIndicator = styled(BaseFormInputUsdIndicator)`
  top: 34px;
  left: unset;
  right: 8px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    top: 34px;
    left: unset;
  }
`;

const InputTokenLabelRow = styled(BaseFormLabelRow)`
  position: absolute;
  top: 28px;
  left: 8px;
  height: 32px;
  gap: 8px;
  border-radius: 8px;
  background: #314156;
  padding: 8px 16px;

  img {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-bottom: -1px;
  }
`;
const InputTokenLabelSymbol = styled("div")`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
`;

const CalcFormWrapper = styled(FlexBox)`
  gap: 18px;
  margin-top: 12px;
  &.tfVault {
    flex-direction: column;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
  }
`;

const InputTokenLabel = ({
  tokenAddress,
  tokenSymbol,
}: {
  tokenAddress: string;
  tokenSymbol: string;
}) => {
  return (
    <InputTokenLabelRow>
      <Image src={getTokenLogoURL(tokenAddress)} alt={tokenSymbol} />
      <InputTokenLabelSymbol>{tokenSymbol}</InputTokenLabelSymbol>
    </InputTokenLabelRow>
  );
};

const getEstimatedEarning = (
  depositAmount: string,
  apy: string,
  days: number
): string => {
  if (
    !depositAmount ||
    !days ||
    BigNumber(depositAmount).isLessThanOrEqualTo("0") ||
    BigNumber(apy).isEqualTo("0")
  ) {
    return "0";
  }

  const principal = BigNumber(depositAmount);
  const annualRate = BigNumber(apy).div(100);
  const timeInYears = BigNumber(days).div(365);

  const profit = principal.times(annualRate).times(timeInYears);

  return profit.toFixed(2);
};

const VaultProfitCalculator = () => {
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [estimatedEarning, setEstimatedEarning] = useState<string>("0");

  const { vault, isTfVaultType, tfVaultDepositEndDate, tfVaultLockEndDate } =
    useVaultContext();
  const { token } = vault;

  const apr = useAprNumber(vault);

  const fxdPrice = 1;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let period = 365;

    if (isTfVaultType) {
      period = getPeriodInDays(tfVaultDepositEndDate, tfVaultLockEndDate);
    }

    setTokenAmount(e.target.value);
    setEstimatedEarning(
      getEstimatedEarning(e.target.value, apr.toString(), period)
    );
  };

  if (!token) {
    return (
      <Paper sx={{ height: "100%" }}>
        <SummaryWrapper>
          <Typography variant="h3" sx={{ fontSize: "16px" }}>
            Annual Percentage Yield (APY) Calculator
          </Typography>
        </SummaryWrapper>
        <CalcFormWrapper>
          <CustomSkeleton
            variant="rounded"
            animation={"wave"}
            width="100%"
            height="72px"
          />
          <CustomSkeleton
            variant="rounded"
            animation={"wave"}
            width="100%"
            height="72px"
          />
        </CalcFormWrapper>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: "100%" }}>
      <SummaryWrapper>
        <Typography variant="h3" sx={{ fontSize: "16px" }}>
          {isTfVaultType
            ? `Percentage Yield Calculator for ${getPeriodInDays(
                tfVaultDepositEndDate,
                tfVaultLockEndDate
              )} days deposit`
            : "Annual Percentage Yield (APY) Calculator"}
        </Typography>
      </SummaryWrapper>
      <CalcFormWrapper className={isTfVaultType ? "tfVault" : ""}>
        <CalculatorInputWrapper>
          <BaseFormLabelRow pb={1}>
            <BaseFormInputLabel>I have</BaseFormInputLabel>
          </BaseFormLabelRow>
          <CalculatorTextField
            error={!!(tokenAmount && isNaN(tokenAmount as unknown as number))}
            id="outlined-helperText"
            placeholder={"0"}
            helperText={
              <>
                {!!(tokenAmount && isNaN(tokenAmount as unknown as number)) && (
                  <BaseFormInputErrorWrapper>
                    <BaseInfoIcon
                      sx={{
                        float: "left",
                        width: "14px",
                        height: "14px",
                        marginRight: "0",
                      }}
                    />
                    <Box
                      component={"span"}
                      sx={{ fontSize: "12px", paddingLeft: "6px" }}
                    >
                      Deposit value must be greater than 0
                    </Box>
                  </BaseFormInputErrorWrapper>
                )}
              </>
            }
            value={tokenAmount}
            type="number"
            onChange={onChange}
          />
          <CalculatorUsdIndicator>{`$${formatNumber(
            BigNumber(tokenAmount || 0)
              .multipliedBy(fxdPrice)
              .toNumber()
          )}`}</CalculatorUsdIndicator>
          <InputTokenLabel
            tokenAddress={token.id}
            tokenSymbol={token?.symbol}
          />
        </CalculatorInputWrapper>
        <CalculatorInputWrapper>
          <BaseFormLabelRow pb={1}>
            <BaseFormInputLabel>Estimated earning</BaseFormInputLabel>
          </BaseFormLabelRow>
          <CalculatorTextField
            disabled
            id="outlined-helperText"
            placeholder={"0"}
            value={`+ ${estimatedEarning} ${token?.symbol}`}
            type="string"
          />
          <CalculatorUsdIndicator>{`$${formatNumber(
            BigNumber(estimatedEarning || 0)
              .multipliedBy(fxdPrice)
              .toNumber()
          )}`}</CalculatorUsdIndicator>
        </CalculatorInputWrapper>
      </CalcFormWrapper>
    </Paper>
  );
};

export default memo(VaultProfitCalculator);
