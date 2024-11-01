import WormholeConnect, {
  WormholeConnectConfig,
  WormholeConnectEvent,
  DEFAULT_ROUTES,
} from "@wormhole-foundation/wormhole-connect";
import { useCallback, useState } from "react";
import { MAINNET_RPC } from "@/utils/network";
import VaultsNestedNav from "@/components/Vaults/NestedNav";
import useBridgeContext, { BridgeType } from "@/context/bridge";
import { useRouter } from "next/router";
import PageContainer from "@/components/Base/PageContainer";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";

const VaultBridgeButtonsWrapper = styled(Box)`
  display: flex;
  justify-content: center;

  & > button {
    height: 48px;
    font-size: 17px;
    font-weight: 600;
    padding: 8px 32px;

    &:first-of-type {
      width: 450px;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    & > button {
      height: 36px;
      font-size: 15px;
      padding: 4px 18px;
    }
  }
`;

const VaultBridge = () => {
  const { setBridgeInfo } = useBridgeContext();
  const router = useRouter();
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const [bridgedInfo, setBridgedInfo] = useState<any>();

  const handleDepositBridget = useCallback(() => {
    setBridgeInfo({
      type: BridgeType.CreateVaultDepositFromBridgedUSDC,
      ...bridgedInfo,
    });
    router.push("/vaults");
  }, [router, bridgedInfo, setBridgeInfo]);

  const [wormholeConfig] = useState<WormholeConnectConfig>({
    network: "Mainnet",
    routes: [...DEFAULT_ROUTES],
    chains: ["Arbitrum", "Solana"],
    tokens: ["USDCsol", "USDCarbitrum"],
    rpcs: {
      Solana: MAINNET_RPC,
    },
    eventHandler: (event: WormholeConnectEvent) => {
      if (event.type === "wallet.connect") {
        setShowBtn(false);
      } else if (event.type === "transfer.success") {
        console.log("Transfer Success", event.details);
        setBridgedInfo(event.details);
        setShowBtn(true);
      }
    },
  });

  return (
    <>
      <VaultsNestedNav />
      <PageContainer displayNotice={false}>
        <VaultBridgeButtonsWrapper>
          <Button
            variant="gradient"
            disabled={!showBtn}
            onClick={handleDepositBridget}
          >
            Deposit Bridget Assets to Vault
          </Button>
        </VaultBridgeButtonsWrapper>
        <WormholeConnect config={wormholeConfig} />
      </PageContainer>
    </>
  );
};

export default VaultBridge;
