import { FC } from "react";
import { Box, styled } from "@mui/material";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import BigNumber from "bignumber.js";

import { getTokenLogoURL } from "@/utils/tokenLogo";
import { formatNumber } from "@/utils/format";
import { IVault } from "@/utils/TempData";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import {
  BaseDialogFormWrapper,
  BaseFormInputErrorWrapper,
  BaseFormInputLabel,
  BaseFormInputLogo,
  BaseFormInputUsdIndicator,
  BaseFormInputWrapper,
  BaseFormLabelRow,
  BaseFormSetMaxButton,
  BaseFormTextField,
  BaseFormWalletBalance,
} from "@/components/Base/Form/StyledForm";
import { BaseInfoIcon } from "@/components/Base/Icons/StyledIcons";

const ManageVaultForm = styled("form")`
  padding-bottom: 0;
`;

type VaultDepositFormProps = {
  vaultItemData: IVault;
  walletBalance: string;
  control: Control<
    {
      deposit: string;
      sharedToken: string;
    },
    any
  >;
  setMax: () => void;
  validateMaxDepositValue: (value: string) => true | string;
  handleSubmit: UseFormHandleSubmit<
    {
      deposit: string;
      sharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  minimumDeposit: number;
  depositLimitExceeded: (value: string) => string | boolean;
  isDetailPage?: boolean;
};

const DepositVaultForm: FC<VaultDepositFormProps> = ({
  vaultItemData,
  walletBalance,
  control,
  setMax,
  validateMaxDepositValue,
  handleSubmit,
  onSubmit,
  minimumDeposit,
  depositLimitExceeded,
  isDetailPage = false,
}) => {
  const { token, shareToken, depositLimit, balanceTokens, shutdown } =
    vaultItemData;
  const fxdPrice = "1";

  return (
    <BaseDialogFormWrapper
      sx={{
        background: isDetailPage ? "#3A4F6A" : "#314156",
        padding: isDetailPage ? "22px 16px" : "16px",
      }}
    >
      <ManageVaultForm
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Controller
          control={control}
          name="deposit"
          rules={{
            required: true,
            min: minimumDeposit,
            validate: validateMaxDepositValue,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <BaseFormInputWrapper>
              <BaseFormLabelRow>
                <BaseFormInputLabel>Deposit {token?.name}</BaseFormInputLabel>
                <FlexBox sx={{ width: "auto", justifyContent: "flex-end" }}>
                  <BaseFormWalletBalance>
                    Balance:{" "}
                    {formatNumber(
                      BigNumber(walletBalance)
                        .dividedBy(10 ** token?.decimals)
                        .toNumber()
                    ) +
                      " " +
                      token?.name}
                  </BaseFormWalletBalance>
                </FlexBox>
              </BaseFormLabelRow>
              <BaseFormTextField
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {!shutdown && depositLimitExceeded(value) && (
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
                          {depositLimitExceeded(value)}
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                    {error && error.type === "required" && (
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
                          This field is required
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                    {error && error.type === "validate" && (
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
                          {error.message}
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                    {error && error.type === "min" && (
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
                          Minimum deposit is {formatNumber(minimumDeposit)}{" "}
                          {token?.name}
                        </Box>
                      </BaseFormInputErrorWrapper>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={(e) => {
                  let inputValue = e.target.value;

                  const regex = /^\d+(\.\d{0,9})?$/;

                  if (regex.test(inputValue)) {
                    onChange(inputValue);
                  } else {
                    const truncatedValue = inputValue.slice(
                      0,
                      inputValue.indexOf(".") + 10
                    );
                    onChange(truncatedValue);
                  }
                }}
              />
              <BaseFormInputUsdIndicator>{`$${formatNumber(
                BigNumber(value || 0)
                  .multipliedBy(fxdPrice)
                  .toNumber()
              )}`}</BaseFormInputUsdIndicator>
              <BaseFormInputLogo
                className={"extendedInput"}
                src={getTokenLogoURL(token?.id)}
                alt={token?.name}
              />
              <BaseFormSetMaxButton onClick={() => setMax()}>
                Max
              </BaseFormSetMaxButton>
            </BaseFormInputWrapper>
          )}
        />
        <Controller
          control={control}
          name="sharedToken"
          rules={{
            max: BigNumber(depositLimit)
              .minus(BigNumber(balanceTokens))
              .dividedBy(10 ** shareToken?.decimals)
              .toNumber(),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <BaseFormInputWrapper>
                <BaseFormLabelRow>
                  <BaseFormInputLabel>Receive shares token</BaseFormInputLabel>
                </BaseFormLabelRow>
                <BaseFormTextField
                  error={!!error}
                  id="outlined-helperText"
                  className={isDetailPage ? "lightBorder" : ""}
                  helperText={
                    <>
                      {error && error.type === "max" && (
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
                            Maximum available share token is{" "}
                            {formatNumber(
                              BigNumber(depositLimit)
                                .minus(BigNumber(balanceTokens))
                                .dividedBy(10 ** shareToken?.decimals)
                                .toNumber()
                            )}
                            .
                          </Box>
                        </BaseFormInputErrorWrapper>
                      )}
                    </>
                  }
                  value={value}
                  type="number"
                  placeholder={"0"}
                  onChange={onChange}
                  disabled
                />
                <BaseFormInputLogo
                  src={getTokenLogoURL(token?.id)}
                  alt={token?.name}
                />
              </BaseFormInputWrapper>
            );
          }}
        />
      </ManageVaultForm>
    </BaseDialogFormWrapper>
  );
};

export default DepositVaultForm;
