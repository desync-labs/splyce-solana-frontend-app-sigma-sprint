import { FC, memo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import {
  Box,
  Button,
  CircularProgress,
  ListItemText,
  Paper,
  styled,
} from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import CloseIcon from "@mui/icons-material/Close";

import { getTokenLogoURL } from "@/utils/tokenLogo";
import { formatCurrency, formatNumber } from "@/utils/format";
import { IVault, IVaultPosition } from "@/utils/TempData";
import { useApr } from "@/hooks/Vaults/useApr";
import {
  VaultListItemImageWrapper,
  VaultTagLabel,
  VaultTitle,
} from "@/components/Vaults/List/VaultListItemMobile";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import { VaultStacked } from "@/components/Vaults/List/VaultListItem";
import BaseDialogFullScreen from "@/components/Base/Dialog/FullScreenDialog";
import { BaseDialogButtonWrapper } from "@/components/Base/Dialog/StyledDialog";
import {
  BreadcrumbsWrapper,
  VaultBreadcrumbsCurrentPage,
} from "@/components/Base/Breadcrumbs/StyledBreadcrumbs";
import {
  BaseListItem,
  BaseListPreviewModal,
} from "@/components/Base/List/StyledList";

import LockAquaSrc from "@/assets/svg/lock-aqua.svg";
import LockSrc from "@/assets/svg/lock.svg";

const VaultBreadcrumbsCloseModal = styled("div")`
  color: #6d86b2;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
`;

const LockedIconWrapper = styled("div")`
  display: flex;
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 4px;
  background: rgba(79, 101, 140, 0.2);
`;

const ButtonsWrapper = styled(BaseDialogButtonWrapper)`
  gap: 8px;
  & > button {
    height: 40px;
    width: calc(50% - 4px) !important;
    font-size: 15px;
    font-weight: 600;
    padding: 10px 16px;
  }
`;

type PseudoBreadcrumbsProps = {
  vaultName: string;
  handleCloseModal: () => void;
};

const PseudoBreadcrumbs: FC<PseudoBreadcrumbsProps> = memo(
  ({ vaultName, handleCloseModal }) => {
    const breadcrumbs = [
      <VaultBreadcrumbsCloseModal key="1" onClick={handleCloseModal}>
        Vaults
      </VaultBreadcrumbsCloseModal>,
      <VaultBreadcrumbsCurrentPage key="2">
        {vaultName}
      </VaultBreadcrumbsCurrentPage>,
    ];

    return (
      <BreadcrumbsWrapper
        separator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </BreadcrumbsWrapper>
    );
  }
);

interface VaultListItemPreviewModalProps {
  isOpenPreviewModal: boolean;
  vault: IVault;
  vaultPosition: IVaultPosition | undefined;
  balanceEarned?: number;
  handleClosePreview: () => void;
  setNewVaultDeposit: (value: boolean) => void;
  setManageVault: (value: boolean) => void;
  handleWithdrawAll: () => void;
  isTfVaultType: boolean;
  activeTfPeriod: number;
  isWithdrawLoading: boolean;
}

const BreadcrumbsContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const VaultListItemPreviewModal: FC<VaultListItemPreviewModalProps> = ({
  vault,
  vaultPosition,
  balanceEarned = 10000,
  handleClosePreview,
  isOpenPreviewModal,
  setNewVaultDeposit,
  setManageVault,
  handleWithdrawAll,
  isTfVaultType,
  activeTfPeriod,
  isWithdrawLoading,
}) => {
  const { token, shutdown, balanceTokens, depositLimit } = vault;
  const location = useRouter();
  const formattedApr = useApr(vault);
  const fxdPrice = 1;

  const redirectToVaultDetail = useCallback(() => {
    location.push(`/vaults/${vault.id}`);
  }, [vault.id, location]);

  return (
    <BaseDialogFullScreen
      isOpen={isOpenPreviewModal}
      onClose={handleClosePreview}
    >
      <BreadcrumbsContainer>
        <PseudoBreadcrumbs
          vaultName={vault.name}
          handleCloseModal={handleClosePreview}
        />
        <CloseIcon sx={{ color: "#fff" }} onClick={handleClosePreview} />
      </BreadcrumbsContainer>
      <FlexBox>
        <FlexBox sx={{ justifyContent: "flex-start", gap: "4px" }}>
          <VaultListItemImageWrapper>
            <Image src={getTokenLogoURL(token.id)} alt={token.name} />
          </VaultListItemImageWrapper>
          <VaultTitle>{vault.name}</VaultTitle>
        </FlexBox>
        {vaultPosition?.balancePosition &&
        BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) &&
        !shutdown ? (
          <VaultTagLabel>Earning</VaultTagLabel>
        ) : shutdown ? (
          <VaultTagLabel>Finished</VaultTagLabel>
        ) : (
          <VaultTagLabel>Live</VaultTagLabel>
        )}
      </FlexBox>
      <Paper sx={{ marginTop: "10px" }}>
        <BaseListPreviewModal>
          <BaseListItem
            secondaryAction={
              <>
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
              </>
            }
          >
            <ListItemText primary={"Earned"} />
          </BaseListItem>
          <BaseListItem secondaryAction={<>{formattedApr}%</>}>
            <ListItemText primary={"APY"} />
          </BaseListItem>
          <BaseListItem
            secondaryAction={
              <>
                {formatCurrency(
                  BigNumber(fxdPrice)
                    .multipliedBy(
                      BigNumber(balanceTokens).dividedBy(10 ** token.decimals)
                    )
                    .toNumber()
                )}
              </>
            }
          >
            <ListItemText primary={"TVL"} />
          </BaseListItem>
          <BaseListItem
            secondaryAction={
              <>
                {formatNumber(
                  Math.max(
                    BigNumber(depositLimit)
                      .minus(BigNumber(balanceTokens))
                      .dividedBy(10 ** token.decimals)
                      .toNumber(),
                    0
                  )
                )}{" "}
                {token.symbol}
              </>
            }
          >
            <ListItemText primary={"Available"} />
          </BaseListItem>
          <BaseListItem
            secondaryAction={
              <VaultStacked>
                <LockedIconWrapper>
                  {vaultPosition?.balancePosition &&
                  BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) ? (
                    <Image
                      src={LockAquaSrc as string}
                      alt={"locked-active"}
                      width={10}
                      height={10}
                    />
                  ) : (
                    <Image
                      src={LockSrc as string}
                      alt={"locked"}
                      width={10}
                      height={10}
                    />
                  )}
                </LockedIconWrapper>
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
            }
          >
            <ListItemText primary={"Staked"} />
          </BaseListItem>
        </BaseListPreviewModal>
      </Paper>
      <ButtonsWrapper>
        <Button variant="outlined" onClick={redirectToVaultDetail}>
          Detail
        </Button>
        {(!vaultPosition ||
          !BigNumber(vaultPosition.balanceShares).isGreaterThan(0)) &&
          !shutdown &&
          activeTfPeriod !== 2 && (
            <Button
              variant="contained"
              onClick={() => setNewVaultDeposit(true)}
              sx={{ height: "36px", minWidth: "100px" }}
            >
              Deposit
            </Button>
          )}
        {vaultPosition &&
          BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
          !shutdown &&
          activeTfPeriod !== 2 && (
            <Button
              variant="contained"
              onClick={() => setManageVault(true)}
              sx={{ height: "36px", minWidth: "100px" }}
            >
              Manage
            </Button>
          )}
        {vaultPosition &&
          BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
          shutdown &&
          activeTfPeriod !== 2 && (
            <Button
              variant="contained"
              onClick={() => setManageVault(true)}
              sx={{ height: "36px", minWidth: "100px" }}
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
              disabled={isWithdrawLoading}
              sx={{ height: "36px", minWidth: "100px" }}
            >
              Withdraw all
            </Button>
          )}
      </ButtonsWrapper>
    </BaseDialogFullScreen>
  );
};

export default memo(VaultListItemPreviewModal);
