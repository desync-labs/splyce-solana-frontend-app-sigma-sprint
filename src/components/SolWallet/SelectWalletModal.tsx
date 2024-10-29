import { useState } from "react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { Wallet } from "@solana/wallet-adapter-react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import {
  Box,
  Collapse,
  Grid,
  List,
  ListItem,
  Stack,
  Switch,
  Typography,
  styled,
} from "@mui/material";
import { BaseDialogTitle } from "@/components/Base/Dialog/BaseDialogTitle";
import {
  BaseDialogContent,
  BaseDialogWrapper,
} from "@/components/Base/Dialog/StyledDialog";
import { BaseWarningBox, FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import BasePopover from "@/components/Base/Popover/BasePopover";
import {
  BaseButtonSecondary,
  BaseButtonSecondaryLink,
  ExtLinkIcon,
} from "@/components/Base/Buttons/StyledButtons";

const WalletItemWrapper = styled(FlexBox)`
  justify-content: flex-start;
  cursor: not-allowed;
  background: #314156;
  border-radius: 8px;
  opacity: 0.5;
  padding: 8px;

  &.selectable {
    opacity: 1;
    cursor: pointer;
  }
`;

const ScrollableBox = styled(Box)`
  overflow-y: auto;
`;

const WalletItemLabel = styled(FlexBox)`
  justify-content: flex-end;
  width: fit-content;
  background: rgba(81, 109, 115, 0.4);
  border-radius: 8px;
  padding: 4px 8px;
`;

const InstallStepItem = styled(FlexBox)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 4px;
  text-align: start;
  font-size: 14px;
  margin-top: 20px;
  padding-left: 4px;

  & li {
    padding-left: 32px;
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const WalletItemContentFlexBox = styled(FlexBox)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
`;

interface SelectWalletModalProps {
  wallets: Wallet[];
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onSelectWallet: (wallet: Wallet) => void;
  onClose: () => void;
}

const WalletItem = ({
  selectable = true,
  wallet,
  onClick,
}: {
  selectable?: boolean;
  wallet: Wallet;
  // eslint-disable-next-line no-unused-vars
  onClick: (wallet: Wallet) => void;
  isCurrent?: boolean;
}) => {
  return (
    <Grid item xs={6}>
      <WalletItemWrapper
        onClick={() => onClick(wallet)}
        className={selectable ? "selectable" : ""}
      >
        <img
          src={wallet.adapter.icon}
          width={32}
          height={32}
          alt={"wallet_adapter"}
        />
        <WalletItemContentFlexBox>
          <Typography fontWeight={700}>{wallet.adapter.name}</Typography>
          <Box flexGrow={1}></Box>
          {wallet.adapter.name === "Phantom" && (
            <WalletItemLabel>
              <Typography fontSize="12px">Auto confirm</Typography>
              <BasePopover
                id="auto_confirm_tip"
                text="Auto-confirm is now available for all transactions on Splyce."
              />
            </WalletItemLabel>
          )}
          {wallet.adapter.name === "Solflare" && (
            <WalletItemLabel>
              <Typography fontSize="12px">Auto approve</Typography>
              <BasePopover
                id="auto_approve_tip_solflare"
                text="Auto-approve is now available for all transactions on Splyce."
              />
            </WalletItemLabel>
          )}
        </WalletItemContentFlexBox>
      </WalletItemWrapper>
    </Grid>
  );
};

const SelectWalletModal = ({
  wallets,
  isOpen,
  onSelectWallet,
  onClose,
}: SelectWalletModalProps) => {
  const [canShowUninstalledWallets, setCanShowUninstalledWallets] =
    useState(false);
  const [isWalletNotInstalled, setIsWalletNotInstalled] = useState(false);

  const { recommendedWallets, notInstalledWallets } = splitWallets(wallets);

  const phantomWallet = recommendedWallets.find(
    (w) => w.adapter.name === "Phantom"
  );

  return (
    <BaseDialogWrapper
      open={isOpen}
      onClose={onClose}
      fullWidth
      disableScrollLock
    >
      <BaseDialogTitle id="connect_wallet_title" onClose={onClose}>
        Connect your wallet to Splyce
      </BaseDialogTitle>
      <BaseDialogContent>
        {isWalletNotInstalled ? (
          <ScrollableBox>
            <BaseWarningBox sx={{ margin: 0 }}>
              <Typography>
                Oops... Looks like you don’t have Phantom installed!
              </Typography>
            </BaseWarningBox>
            <FlexBox mt={5} sx={{ justifyContent: "center" }}>
              <img
                src={phantomWallet?.adapter.icon as string}
                width={100}
                height={100}
                alt={"install_phantom"}
              />
            </FlexBox>
            <FlexBox mt={3} sx={{ justifyContent: "center" }}>
              <BaseButtonSecondaryLink
                href="https://phantom.app"
                target={"_blank"}
              >
                Install Phantom
                <ExtLinkIcon />
              </BaseButtonSecondaryLink>
            </FlexBox>
            <FlexBox
              px={1.5}
              mt={6}
              sx={{ flexDirection: "column", alignItems: "start" }}
            >
              <Typography>How to install Phantom?</Typography>
              <InstallStepItem>
                <FlexBox sx={{ justifyContent: "flex-start" }}>
                  <SmartphoneRoundedIcon />
                  <Typography fontWeight="medium">On mobile:</Typography>
                </FlexBox>
                <List>
                  <ListItem>Download and open the wallet app instead</ListItem>
                </List>
              </InstallStepItem>
              <InstallStepItem>
                <FlexBox sx={{ justifyContent: "flex-start" }}>
                  <ComputerRoundedIcon />
                  <Typography fontWeight="medium">On desktop:</Typography>
                </FlexBox>
                <List>
                  <ListItem>
                    Install at link above then refresh this page
                  </ListItem>
                </List>
              </InstallStepItem>
            </FlexBox>
            <FlexBox px={1.5} mt={6} sx={{ flexDirection: "column" }}>
              <BaseButtonSecondary
                onClick={() => {
                  if (
                    !phantomWallet ||
                    phantomWallet.readyState == WalletReadyState.NotDetected
                  ) {
                    window.location.reload();
                  } else {
                    onSelectWallet(phantomWallet);
                    onClose();
                  }
                }}
                sx={{ borderColor: "transparent" }}
              >
                I’ve already Installed, Refresh page
              </BaseButtonSecondary>
              <BaseButtonSecondary
                onClick={() => {
                  setIsWalletNotInstalled(false);
                }}
                sx={{ borderColor: "transparent" }}
              >
                Go back
              </BaseButtonSecondary>
            </FlexBox>
          </ScrollableBox>
        ) : (
          <Box>
            <ScrollableBox mb={6}>
              <Typography variant="h4" fontWeight={600} mb={2}>
                Choose wallet
              </Typography>
              <Grid container spacing={2}>
                {recommendedWallets.map((wallet) => (
                  <WalletItem
                    key={wallet.adapter.name}
                    selectable
                    wallet={wallet}
                    onClick={(wallet) => {
                      if (
                        wallet.readyState == WalletReadyState.NotDetected &&
                        wallet.adapter.name === "Phantom"
                      ) {
                        setIsWalletNotInstalled(true);
                        return;
                      }
                      onSelectWallet(wallet);
                    }}
                  />
                ))}
              </Grid>

              <Collapse in={canShowUninstalledWallets}>
                <Stack fontSize="sm" my={3}>
                  <Box flexGrow={1} height="1px"></Box>
                  <Typography>Uninstalled wallets</Typography>
                  <Box flexGrow={1} height="1px"></Box>
                </Stack>

                <Grid container spacing={2}>
                  {notInstalledWallets.map((wallet) => (
                    <WalletItem
                      selectable={false}
                      key={wallet.adapter.name}
                      wallet={wallet}
                      onClick={onSelectWallet}
                    />
                  ))}
                </Grid>
              </Collapse>
            </ScrollableBox>
            <FlexBox
              py={2}
              px={2.5}
              mb={1.5}
              bgcolor="#314156"
              borderRadius="16px"
            >
              <FlexBox sx={{ justifyContent: "flex-start" }}>
                <AccountBalanceWalletOutlinedIcon />
                <Typography>Show uninstalled wallets</Typography>
              </FlexBox>
              <Switch
                checked={canShowUninstalledWallets}
                onChange={() => setCanShowUninstalledWallets((b) => !b)}
              />
            </FlexBox>
          </Box>
        )}
      </BaseDialogContent>
    </BaseDialogWrapper>
  );
};

function splitWallets(wallets: Wallet[]): {
  recommendedWallets: Wallet[];
  notInstalledWallets: Wallet[];
} {
  const supportedWallets = wallets.filter(
    (w) => w.readyState !== WalletReadyState.Unsupported
  );
  const recommendedWallets = supportedWallets.filter(
    (w) =>
      w.readyState !== WalletReadyState.NotDetected &&
      w.adapter.name !== "Sollet"
  );
  const notInstalledWallets = supportedWallets.filter(
    (w) =>
      w.readyState == WalletReadyState.NotDetected &&
      w.adapter.name !== "Phantom"
  );
  const solletWallet = supportedWallets.find(
    (w) => w.adapter.name === "Sollet"
  );
  solletWallet && notInstalledWallets.push(solletWallet);
  const phantomWallet = supportedWallets.find(
    (w) => w.adapter.name === "Phantom"
  );
  phantomWallet &&
    phantomWallet.readyState == WalletReadyState.NotDetected &&
    recommendedWallets.unshift(phantomWallet);
  return { recommendedWallets, notInstalledWallets };
}

export default SelectWalletModal;
