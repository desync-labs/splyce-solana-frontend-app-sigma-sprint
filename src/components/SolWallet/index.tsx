import { useCallback, useState } from "react";
import { Wallet, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Typography, styled } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { encodeStr } from "@/utils/common";
import SelectWalletModal from "./SelectWalletModal";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import WalletInfoModal from "@/components/SolWallet/WalletInfoModal";
import { WalletButton } from "@/components/Base/Buttons/StyledButtons";

const WalletInfo = styled(FlexBox)`
  justify-content: flex-end;
  width: fit-content;
  gap: 0;
  background-color: #2e3a4c;
  border-radius: 8px;
  cursor: pointer;
  padding: 6px 16px;

  & img {
    margin-right: 8px;
  }

  & svg {
    margin-left: 4px;
    margin-right: -8px;
  }
`;

const SolWallet = () => {
  const { wallets, select, connected, wallet, disconnect, publicKey } =
    useWallet();
  const { setVisible, visible } = useWalletModal();
  const [isWalletDrawerShown, setIsWalletDrawerShown] = useState(false);

  const handleClose = useCallback(() => setVisible(false), [setVisible]);
  const handleOpen = useCallback(() => setVisible(true), [setVisible]);

  const handleSelectWallet = (wallet: Wallet) => {
    select(wallet.adapter.name);
    handleClose();
  };

  const handleShowWalletDrawer = () => setIsWalletDrawerShown(true);
  const onClose = () => setIsWalletDrawerShown(false);

  if (connected && publicKey && wallet)
    return (
      <>
        <WalletInfoModal
          wallet={wallet}
          pubKey={publicKey}
          onDisconnect={disconnect}
          isOpen={isWalletDrawerShown}
          onClose={onClose}
        />
        <FlexBox sx={{ justifyContent: "flex-end" }}>
          <WalletInfo onClick={handleShowWalletDrawer}>
            {wallet && (
              <img
                src={wallet.adapter.icon}
                width="20px"
                height="20px"
                alt={"wallet"}
              />
            )}
            <Typography>{encodeStr(publicKey?.toBase58(), 4)}</Typography>
            <KeyboardArrowDownRoundedIcon sx={{ width: "16px" }} />
          </WalletInfo>
        </FlexBox>
      </>
    );
  return (
    <>
      <FlexBox sx={{ justifyContent: "flex-end" }}>
        <WalletButton onClick={handleOpen}>Connect Wallet</WalletButton>
      </FlexBox>
      <SelectWalletModal
        wallets={wallets}
        isOpen={visible}
        onClose={handleClose}
        onSelectWallet={handleSelectWallet}
      />
    </>
  );
};

export default SolWallet;
