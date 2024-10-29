import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, ListItemText } from "@mui/material";

import { useApr } from "@/hooks/Vaults/useApr";
import { FormType } from "@/hooks/Vaults/useVaultManageDeposit";
import { formatNumber, formatPercentage } from "@/utils/format";
import { IVault, IVaultPosition } from "@/utils/TempData";

import {
  BaseDialogFormInfoWrapper,
  BaseDialogSummary,
  BaseFormInfoList,
} from "@/components/Base/Form/StyledForm";
import { BaseListItem } from "@/components/Base/List/StyledList";

type VaultManageInfoProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  formToken: string;
  formSharedToken: string;
  formType: FormType;
};

const ManageVaultInfo: FC<VaultManageInfoProps> = ({
  formType,
  vaultItemData,
  vaultPosition,
  formToken,
  formSharedToken,
}) => {
  const { token, shareToken, sharesSupply, performanceFees } = vaultItemData;
  const { balancePosition, balanceShares } = vaultPosition;
  const formattedApr = useApr(vaultItemData);

  return (
    <BaseDialogFormInfoWrapper>
      <BaseDialogSummary>Summary</BaseDialogSummary>
      <Divider />
      <BaseFormInfoList>
        <BaseListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balancePosition)
                  .dividedBy(10 ** token.decimals)
                  .toNumber()
              ) +
                " " +
                token.name +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balancePosition)
                        .dividedBy(10 ** token.decimals)
                        .plus(BigNumber(formToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    token.name +
                    " "
                  : formatPercentage(
                      Math.max(
                        BigNumber(balancePosition)
                          .dividedBy(10 ** token.decimals)
                          .minus(BigNumber(formToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    token.name +
                    " "}
              </Box>
            </>
          }
        >
          <ListItemText primary={token.name + " Deposited"} />
        </BaseListItem>
        <BaseListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {`${formatNumber(
                BigNumber(balanceShares)
                  // todo: chenge to sharesSupply when it will be available
                  .dividedBy(BigNumber(vaultItemData.totalShare))
                  .multipliedBy(100)
                  .toNumber()
              )} %`}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatNumber(
                      BigNumber(balanceShares)
                        .plus(
                          BigNumber(formSharedToken || "0").multipliedBy(
                            10 ** shareToken.decimals
                          )
                        )
                        .dividedBy(
                          // todo: chenge to sharesSupply when it will be available
                          BigNumber(vaultItemData.totalShare).plus(
                            BigNumber(formSharedToken || "0").multipliedBy(
                              10 ** shareToken.decimals
                            )
                          )
                        )
                        .multipliedBy(100)
                        .toNumber()
                    )
                  : BigNumber(formSharedToken)
                        .multipliedBy(10 ** shareToken.decimals)
                        // todo: chenge to sharesSupply when it will be available
                        .isEqualTo(BigNumber(vaultItemData.totalShare))
                    ? "0"
                    : formatNumber(
                        Math.max(
                          BigNumber(balanceShares)
                            .minus(
                              BigNumber(formSharedToken || "0").multipliedBy(
                                10 ** shareToken.decimals
                              )
                            )
                            .dividedBy(
                              // todo: chenge to sharesSupply when it will be available
                              BigNumber(vaultItemData.totalShare).minus(
                                BigNumber(formSharedToken || "0").multipliedBy(
                                  10 ** shareToken.decimals
                                )
                              )
                            )
                            .multipliedBy(100)
                            .toNumber(),
                          0
                        )
                      )}{" "}
                %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </BaseListItem>
        <BaseListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balanceShares)
                  .dividedBy(10 ** shareToken.decimals)
                  .toNumber()
              ) +
                " " +
                shareToken.name +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balanceShares)
                        .dividedBy(10 ** shareToken.decimals)
                        .plus(BigNumber(formSharedToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    shareToken.name
                  : formatPercentage(
                      Math.max(
                        BigNumber(balanceShares)
                          .dividedBy(10 ** shareToken.decimals)
                          .minus(BigNumber(formSharedToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    shareToken.name}{" "}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </BaseListItem>
        <BaseListItem
          alignItems="flex-start"
          secondaryAction={
            formatPercentage(
              BigNumber(performanceFees).dividedBy(100).toNumber()
            ) + "%"
          }
        >
          <ListItemText primary="Total Fee" />
        </BaseListItem>
        <BaseListItem
          alignItems="flex-start"
          secondaryAction={formattedApr + "%"}
        >
          <ListItemText primary="Estimated APY" />
        </BaseListItem>
      </BaseFormInfoList>
    </BaseDialogFormInfoWrapper>
  );
};

export default memo(ManageVaultInfo);
