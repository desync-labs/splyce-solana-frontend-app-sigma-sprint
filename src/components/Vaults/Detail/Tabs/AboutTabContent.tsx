import Link from "next/link";
import BigNumber from "bignumber.js";
import { Box, ListItemText, styled, Typography } from "@mui/material";
import {
  VaultAboutTitle,
  vaultDescription,
} from "@/utils/Vaults/getVaultTitleAndDescription";
import { getExplorerUrl } from "@/utils/explorer";
import { formatNumber, formatPercentage } from "@/utils/format";
import { getDefaultVaultDescription } from "@/utils/Vaults/getVaultTitleAndDescription";
import useVaultContext from "@/context/vaultDetail";
import { useAprNumber } from "@/hooks/Vaults/useApr";
import {
  AppListApy,
  AppListFees,
  VaultContractAddress,
  VaultDescriptionWrapper,
} from "@/components/Vaults/Detail/Tabs/InfoTabAbout";
import BasePopover from "@/components/Base/Popover/BasePopover";
import { BaseListItem } from "@/components/Base/List/StyledList";

const FeesItemWrapper = styled(Box)`
  display: flex;
  gap: 4px;
`;

const VaultAboutTabContent = () => {
  const { vault, vaultAddress, performanceFee } = useVaultContext();
  const aprNumber = useAprNumber(vault);

  // todo: integrate fees for other vault types
  const totalFee = performanceFee;
  const depositFee = "0";
  const managementFee = "0";
  return (
    <>
      <VaultDescriptionWrapper>
        {vaultDescription[vault.id.toLowerCase()] ? (
          vaultDescription[vault.id.toLowerCase()]
        ) : (
          <>
            <VaultAboutTitle variant="h5">Description</VaultAboutTitle>
            <Typography>{getDefaultVaultDescription(vault.type)}</Typography>
          </>
        )}
      </VaultDescriptionWrapper>
      <VaultContractAddress>
        Vault Program address:{" "}
        <Link href={getExplorerUrl(vaultAddress)} target="_blank">
          {vaultAddress}
        </Link>
      </VaultContractAddress>
      <Box>
        <VaultAboutTitle variant="h5" sx={{ marginBottom: 0 }}>
          APY
        </VaultAboutTitle>
        <Box width={"100%"}>
          <AppListApy>
            <BaseListItem
              secondaryAction={
                <>
                  {formatNumber(BigNumber(aprNumber).dividedBy(52).toNumber())}%
                </>
              }
            >
              <ListItemText primary={"Weekly APY"} />
            </BaseListItem>
            <BaseListItem
              secondaryAction={
                <>
                  {formatNumber(BigNumber(aprNumber).dividedBy(12).toNumber())}%
                </>
              }
            >
              <ListItemText primary={"Monthly APY"} />
            </BaseListItem>
            <BaseListItem
              secondaryAction={
                <>{formatNumber(BigNumber(aprNumber).toNumber())}%</>
              }
            >
              <ListItemText primary={"Yearly APY"} />
            </BaseListItem>
            {/*<BaseListItem secondaryAction={<>{formatNumber(aprNumber)}%</>}>*/}
            {/*  <ListItemText primary={'Estimated APY'} />*/}
            {/*</BaseListItem>*/}
            {/*<BaseListItem secondaryAction={<>{formatNumber(aprNumber)}%</>}>*/}
            {/*  <ListItemText primary={'Historical APY'} />*/}
            {/*</BaseListItem>*/}
          </AppListApy>
        </Box>
      </Box>
      <Box>
        <VaultAboutTitle sx={{ marginBottom: 0 }}>Fees</VaultAboutTitle>
        <AppListFees>
          <BaseListItem
            secondaryAction={<>{`${formatPercentage(Number(totalFee))}%`}</>}
          >
            <ListItemText
              primary={
                <FeesItemWrapper>
                  Total Fee
                  <BasePopover
                    id={"protocol-fee"}
                    text={
                      "Taken from the performance fee as a percentage of it."
                    }
                    iconSize={"15px"}
                  />
                </FeesItemWrapper>
              }
            />
          </BaseListItem>
          <BaseListItem
            secondaryAction={<>{`${formatPercentage(Number(depositFee))}%`}</>}
          >
            <ListItemText
              primary={
                <FeesItemWrapper>
                  Deposit/Withdrawal Fee
                  <BasePopover
                    id={"total-fee"}
                    text={
                      "The fee is charged from the gain (performance fee) and shared between the manager and protocol."
                    }
                    iconSize={"15px"}
                  />
                </FeesItemWrapper>
              }
            />
          </BaseListItem>
          <BaseListItem
            secondaryAction={
              <>{`${formatPercentage(Number(managementFee))}%`}</>
            }
          >
            <ListItemText
              primary={
                <FeesItemWrapper>
                  Management Fee
                  <BasePopover
                    id={"total-fee"}
                    text={
                      "The fee is charged from the gain (performance fee) and shared between the manager and protocol."
                    }
                    iconSize={"15px"}
                  />
                </FeesItemWrapper>
              }
            />
          </BaseListItem>
          <BaseListItem
            secondaryAction={
              <>{`${formatPercentage(Number(performanceFee))}%`}</>
            }
          >
            <ListItemText
              primary={
                <FeesItemWrapper>
                  Performance Fee
                  <BasePopover
                    id={"total-fee"}
                    text={
                      "The fee is charged from the gain (performance fee) and shared between the manager and protocol."
                    }
                    iconSize={"15px"}
                  />
                </FeesItemWrapper>
              }
            />
          </BaseListItem>
        </AppListFees>
      </Box>
    </>
  );
};

export default VaultAboutTabContent;
