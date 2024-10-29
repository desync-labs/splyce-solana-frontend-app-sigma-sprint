import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, ListItemText } from "@mui/material";
import { formatNumber, formatPercentage } from "@/utils/format";
import { IVault } from "@/utils/TempData";
import { useApr } from "@/hooks/Vaults/useApr";
import {
  BaseDialogFormInfoWrapper,
  BaseDialogSummary,
  BaseFormInfoList,
} from "@/components/Base/Form/StyledForm";
import { BaseListItem } from "@/components/Base/List/StyledList";

type VaultDepositInfoProps = {
  vaultItemData: IVault;
  deposit: string;
  sharedToken: string;
};

const DepositVaultInfo: FC<VaultDepositInfoProps> = ({
  vaultItemData,
  deposit,
  sharedToken,
}) => {
  const { token, shareToken, sharesSupply, performanceFees } = vaultItemData;
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
              0 {token.name + " "}
              <Box component="span" sx={{ color: "#3DA329" }}>
                → {formatPercentage(Number(deposit || "0")) + " " + token.name}
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
              0 %{" "}
              <Box component="span" sx={{ color: "#3DA329" }}>
                →{" "}
                {BigNumber(sharedToken).isGreaterThan(0) ||
                BigNumber(sharesSupply).isGreaterThan(0)
                  ? formatNumber(
                      BigNumber(sharedToken || "0")
                        .multipliedBy(10 ** 9)
                        .dividedBy(
                          // todo: chenge to sharesSupply when it will be available
                          BigNumber(vaultItemData.totalShare).plus(
                            BigNumber(sharedToken || "0").multipliedBy(10 ** 9)
                          )
                        )
                        .times(100)
                        .toNumber()
                    )
                  : "0"}{" "}
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
              {`0 ${shareToken.name} `}
              <Box component="span" sx={{ color: "#3DA329" }}>
                →{" "}
                {formatPercentage(Number(sharedToken || "0")) +
                  " " +
                  shareToken.name}
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

export default memo(DepositVaultInfo);
