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
        {showBtn && (
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Button variant="gradient" onClick={handleDepositBridget}>
              Deposit Bridget Assets to Vault
            </Button>
          </Box>
        )}
        <WormholeConnect config={wormholeConfig} />
      </PageContainer>
    </>
  );
};

export default VaultBridge;
