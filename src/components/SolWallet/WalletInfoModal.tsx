import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { PublicKey } from "@solana/web3.js";
import { Wallet } from "@solana/wallet-adapter-react";
import { Box, Button, Drawer, styled, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { BaseDialogCloseIcon } from "@/components/Base/Dialog/BaseDialogTitle";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import SolanaNetworkIcon from "@/assets/networks/SolanaNetworkIcon";
import EthereumNetworkIcon from "@/assets/networks/EthereumNetworkIcon";
import BinanceNetworkIcon from "@/assets/networks/BinanceNetworkIcon";
import PolygonNetworkIcon from "@/assets/networks/PolygonNetworkIcon";
import { encodeStr } from "@/utils/common";
import { getUserSolanaBalance } from "@/utils/TempSdkMethods";
import { formatNumber } from "@/utils/format";

const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    height: auto;
    min-width: 400px;
    top: 70px;
    right: 20px;
    border-radius: 16px;
  }
`;

const DrawerContent = styled(FlexBox)`
  flex-direction: column;
  justify-content: center;
  padding: 24px 20px;
`;

const WalletLogoWrapper = styled(Box)`
  position: relative;
  & img {
    border-radius: 50%;
  }
`;

const DisconnectButton = styled(Button)`
  height: 48px;
  font-size: 14px;
  font-weight: 600;
  background: rgba(55, 127, 146, 0.25);
  color: #bbfb5b;
  border-radius: 0;
`;

const SolanaBalance = styled(FlexBox)`
  justify-content: center;
  width: 100%;
  padding-top: 8px;

  & span {
    font-size: 16px;
    font-weight: 600;
  }
`;

interface WalletInfoModalProps {
  wallet: Wallet;
  pubKey: PublicKey;
  onDisconnect: () => void;
  isOpen?: boolean;
  onClose: () => void;
}

type WalletInfo = {
  adapterName: string & { __brand__: "WalletName" };
  adapterIcon: string;
  networkIcon:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | string
    | number
    | Iterable<ReactNode>
    | ReactPortal
    | boolean
    | undefined
    | null;
  network: string;
  pubKey: string | undefined;
};

function getNetworkIcon(network: string): ReactNode | undefined {
  switch (network) {
    case "Solana":
      return <SolanaNetworkIcon />;
    case "Ethereum":
      return <EthereumNetworkIcon />;
    case "Binance":
      return <BinanceNetworkIcon />;
    case "Polgon":
      return <PolygonNetworkIcon />;
  }
}

const WalletInfoModal = ({
  wallet,
  pubKey,
  isOpen = false,
  onClose,
  onDisconnect,
}: WalletInfoModalProps) => {
  const solanaWalletInfo: WalletInfo = {
    adapterName: wallet.adapter.name,
    adapterIcon: wallet.adapter.icon,
    network: "Solana",
    networkIcon: getNetworkIcon("Solana"),
    pubKey: pubKey?.toBase58(),
  };

  const [copied, setCopied] = useState<boolean>(false);
  const [solBalance, setSolBalance] = useState<number>(0);

  useEffect(() => {
    getUserSolanaBalance(pubKey)
      .then((balance) => {
        setSolBalance(balance);
      })
      .catch((err) => {
        console.error("Error get balance: ", err);
      });
  }, [pubKey]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pubKey.toString()).then(
      () => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.error("Error copy address: ", err);
      }
    );
  };

  const handleDisConnect = () => {
    onDisconnect();
    onClose();
  };

  return (
    <StyledDrawer anchor={"right"} open={isOpen} onClose={onClose}>
      <BaseDialogCloseIcon aria-label="close" onClick={onClose}>
        <CloseIcon />
      </BaseDialogCloseIcon>

      {solanaWalletInfo && (
        <DrawerContent>
          <WalletLogoWrapper>
            <Image
              src={solanaWalletInfo.adapterIcon as string}
              rounded="full"
              overflow="hidden"
              width={40}
              height={40}
              alt="wallet icon"
            />
            <Box
              sx={{ position: "absolute" }}
              bottom={"-1px"}
              right={"-1px"}
              width="16px"
              height="16px"
            >
              {typeof solanaWalletInfo.networkIcon === "string" ? (
                <Image
                  src={solanaWalletInfo.networkIcon as string}
                  width={16}
                  height={16}
                  alt="network icon"
                />
              ) : (
                solanaWalletInfo.networkIcon
              )}
            </Box>
          </WalletLogoWrapper>
          <SolanaBalance>
            Balance: <span>{formatNumber(solBalance)} SOL</span>
          </SolanaBalance>
          <FlexBox sx={{ justifyContent: "center", gap: 0 }}>
            <Typography>{encodeStr(solanaWalletInfo.pubKey, 8)}</Typography>
            <IconButton disabled={copied} onClick={handleCopy}>
              {copied ? (
                <CheckCircleOutlineRoundedIcon
                  sx={{ width: "16px", height: "16px" }}
                />
              ) : (
                <ContentCopyRoundedIcon
                  sx={{ width: "16px", height: "16px" }}
                />
              )}
            </IconButton>
          </FlexBox>
        </DrawerContent>
      )}
      <Box>
        <DisconnectButton fullWidth onClick={handleDisConnect}>
          Disconnect
        </DisconnectButton>
      </Box>
    </StyledDrawer>
  );
};

export default WalletInfoModal;
