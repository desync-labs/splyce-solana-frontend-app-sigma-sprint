import { FC, memo, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Box,
  TableCell,
  styled,
  Button,
  CircularProgress,
} from "@mui/material";
import BigNumber from "bignumber.js";

import { IVault, IVaultPosition } from "@/utils/TempData";
import { getTokenLogoURL } from "@/utils/tokenLogo";
import { formatCurrency, formatNumber } from "@/utils/format";
import useVaultListItem from "@/hooks/Vaults/useVaultListItem";
import { useApr } from "@/hooks/Vaults/useApr";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import { BaseTableItemRow } from "@/components/Base/Table/StyledTable";
import VaultListItemDepositModal from "@/components/Vaults/List/DepositVaultModal";
import VaultListItemManageModal from "@/components/Vaults/List/ManageVaultModal";

import LockAquaSrc from "assets/svg/lock-aqua.svg";
import LockSrc from "assets/svg/lock.svg";
import useBridgeContext, { BridgeType } from "@/context/bridge";
import { USDC_MINT_ADDRESSES } from "@/utils/addresses";

export const VaultTitle = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-decoration-line: underline;
`;

export const VaultEarned = styled("div")`
  line-height: 20px;
  font-size: 14px;
  color: #fff;
`;

export const VaultApr = styled("div")`
  color: #fff;
`;

export const VaultStackedLiquidity = styled("div")`
  color: #fff;
`;

export const VaultAvailable = styled("div")`
  &.blue {
    color: #6d86b2;
  }
  color: #fff;
  word-break: break-word;
`;

export const VaultStacked = styled("div")`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #6d86b2;
  gap: 12px;

  .img-wrapper {
    background: #4f658c33;
    border-radius: 8px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .value {
    color: #fff;
  }
`;

export const VaultTagLabel = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: fit-content;
  background: #476182;
  font-size: 13px;
  font-weight: 600;
  color: #bbfb5b;
  border-radius: 6px;
  margin-bottom: 4px;
  padding: 4px 8px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: 19px;
  }
`;

export const VaultListItemImageWrapper = styled("div")`
  display: flex;
  justify-content: left;

  img {
    border-radius: 18px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    img {
      margin-top: 0;
    }
  }
`;

type VaultListItemProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
};

const VaultListItem: FC<VaultListItemProps> = ({
  vaultItemData,
  vaultPosition,
}) => {
  const { token, shutdown, balanceTokens, depositLimit } = vaultItemData;
  const router = useRouter();
  const formattedApr = useApr(vaultItemData);

  const { bridgeInfo, setBridgeInfo } = useBridgeContext();
  const {
    balanceEarned,
    manageVault,
    newVaultDeposit,
    setManageVault,
    setNewVaultDeposit,
    isTfVaultType,
    isUserKycPassed,
    tfVaultDepositEndDate,
    tfVaultLockEndDate,
    activeTfPeriod,
    tfVaultDepositLimit,
    handleWithdrawAll,
    minimumDeposit,
    isWithdrawLoading,
    showWithdrawAllButton,
    tfVaultDepositEndTimeLoading,
  } = useVaultListItem({ vaultPosition, vault: vaultItemData });

  const redirectToVaultDetail = useCallback(() => {
    router.push(`/vaults/${vaultItemData.id}`);
  }, [vaultItemData.id]);

  useEffect(() => {
    if (
      USDC_MINT_ADDRESSES.includes(vaultItemData.token.id.toLowerCase()) &&
      bridgeInfo.type === BridgeType.CreateVaultDepositFromBridgedUSDC
    ) {
      if (
        (!vaultPosition ||
          !BigNumber(vaultPosition.balanceShares).isGreaterThan(0)) &&
        !shutdown &&
        activeTfPeriod !== 2 &&
        !tfVaultDepositEndTimeLoading
      ) {
        setNewVaultDeposit(true);
      } else if (
        vaultPosition &&
        BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
        !shutdown &&
        activeTfPeriod !== 2
      ) {
        setManageVault(true);
      }
    }
  }, [
    vaultItemData,
    bridgeInfo,
    vaultPosition,
    shutdown,
    activeTfPeriod,
    tfVaultDepositEndTimeLoading,
  ]);

  const fxdPrice = 1;

  return (
    <>
      <BaseTableItemRow>
        <TableCell
          colSpan={2}
          sx={{ width: "20%", cursor: "pointer" }}
          onClick={redirectToVaultDetail}
        >
          <FlexBox sx={{ justifyContent: "flex-start", gap: "11px" }}>
            <VaultListItemImageWrapper>
              <Image
                src={getTokenLogoURL(token.id)}
                width={24}
                height={24}
                alt={vaultItemData.id}
              />
            </VaultListItemImageWrapper>
            <Box>
              {vaultPosition?.balancePosition &&
              BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) &&
              !shutdown ? (
                <VaultTagLabel>Earning</VaultTagLabel>
              ) : shutdown ? (
                <VaultTagLabel>Finished</VaultTagLabel>
              ) : (
                <VaultTagLabel>Live</VaultTagLabel>
              )}
              <VaultTitle>{vaultItemData.name}</VaultTitle>
            </Box>
          </FlexBox>
        </TableCell>
        <TableCell colSpan={1} sx={{ width: "11%" }}>
          <VaultEarned>
            {balanceEarned && BigNumber(balanceEarned).isGreaterThan(0) ? (
              "$" +
              formatNumber(
                BigNumber(balanceEarned)
                  .multipliedBy(fxdPrice)
                  .dividedBy(10 ** token.decimals)
                  .toNumber()
              )
            ) : balanceEarned === -1 ? (
              <CircularProgress size={20} />
            ) : (
              0
            )}
          </VaultEarned>
        </TableCell>
        <TableCell colSpan={1} sx={{ width: "10%" }}>
          <VaultApr>{formattedApr}%</VaultApr>
        </TableCell>
        <TableCell colSpan={2} sx={{ width: "13%" }}>
          <VaultStackedLiquidity>
            {formatCurrency(
              BigNumber(fxdPrice)
                .multipliedBy(BigNumber(balanceTokens))
                .dividedBy(10 ** token.decimals)
                .toNumber()
            )}
          </VaultStackedLiquidity>
        </TableCell>
        <TableCell colSpan={1} sx={{ width: "14%" }}>
          <VaultAvailable>
            {
              // isTfVaultType
              // ? formatNumber(
              //     BigNumber(tfVaultDepositLimit)
              //       .dividedBy(10 ** 9)
              //       .toNumber()
              //   )
              // :
              formatNumber(
                Math.max(
                  BigNumber(depositLimit)
                    .minus(BigNumber(balanceTokens))
                    .dividedBy(10 ** token.decimals)
                    .toNumber(),
                  0
                )
              )
            }{" "}
            {token.symbol}
          </VaultAvailable>
        </TableCell>
        <TableCell colSpan={1} sx={{ width: "15%" }}>
          <VaultStacked>
            <Box className={"img-wrapper"}>
              {vaultPosition?.balancePosition &&
              BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) ? (
                <Image
                  src={LockAquaSrc as string}
                  alt={"locked-active"}
                  width={20}
                  height={20}
                />
              ) : (
                <Image
                  src={LockSrc as string}
                  alt={"locked"}
                  width={20}
                  height={20}
                />
              )}
            </Box>
            <Box className={"value"}>
              {vaultPosition
                ? formatNumber(
                    BigNumber(vaultPosition.balancePosition)
                      .dividedBy(10 ** token.decimals)
                      .toNumber()
                  )
                : 0}
              {" " + token.symbol}
            </Box>
          </VaultStacked>
        </TableCell>
        <TableCell colSpan={4}>
          <FlexBox
            sx={{
              justifyContent: "flex-end",
              gap: "16px",
              mx: "16px",
              width: "inherit",
            }}
          >
            {(!vaultPosition ||
              !BigNumber(vaultPosition.balanceShares).isGreaterThan(0)) &&
            !shutdown &&
            activeTfPeriod !== 2 &&
            !tfVaultDepositEndTimeLoading ? (
              <Button
                variant="contained"
                onClick={() => setNewVaultDeposit(true)}
                sx={{ minWidth: "100px" }}
              >
                Deposit
              </Button>
            ) : null}
            {vaultPosition &&
              BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
              !shutdown &&
              activeTfPeriod !== 2 && (
                <Button
                  variant="contained"
                  onClick={() => setManageVault(true)}
                  sx={{ minWidth: "100px" }}
                >
                  Manage
                </Button>
              )}
            {vaultPosition &&
              BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
              shutdown &&
              activeTfPeriod < 2 && (
                <Button
                  variant="contained"
                  onClick={() => setManageVault(true)}
                  sx={{ minWidth: "100px" }}
                >
                  Withdraw
                </Button>
              )}
            {vaultPosition &&
              BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
              isTfVaultType &&
              activeTfPeriod === 2 && (
                <Button
                  variant="contained"
                  onClick={handleWithdrawAll}
                  disabled={isWithdrawLoading || !showWithdrawAllButton}
                  sx={{ minWidth: "100px" }}
                >
                  Withdraw all
                </Button>
              )}
          </FlexBox>
        </TableCell>
      </BaseTableItemRow>
      {useMemo(() => {
        return (
          newVaultDeposit && (
            <VaultListItemDepositModal
              vaultItemData={vaultItemData}
              isTfVaultType={isTfVaultType}
              isUserKycPassed={isUserKycPassed}
              tfVaultDepositEndDate={tfVaultDepositEndDate}
              tfVaultLockEndDate={tfVaultLockEndDate}
              activeTfPeriod={activeTfPeriod}
              minimumDeposit={minimumDeposit}
              onClose={() => {
                setNewVaultDeposit(false);
                setBridgeInfo({});
              }}
            />
          )
        );
      }, [newVaultDeposit, setNewVaultDeposit])}
      {useMemo(() => {
        return (
          manageVault && (
            <VaultListItemManageModal
              vaultItemData={vaultItemData}
              vaultPosition={vaultPosition}
              isTfVaultType={isTfVaultType}
              isUserKycPassed={isUserKycPassed}
              tfVaultDepositEndDate={tfVaultDepositEndDate}
              tfVaultLockEndDate={tfVaultLockEndDate}
              activeTfPeriod={activeTfPeriod}
              minimumDeposit={minimumDeposit}
              onClose={() => {
                setManageVault(false);
                setBridgeInfo({});
              }}
            />
          )
        );
      }, [manageVault, setManageVault])}
    </>
  );
};

export default memo(VaultListItem);
