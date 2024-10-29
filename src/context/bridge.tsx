import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type StakingProviderType = {
  children: ReactNode;
};

type UseBridgeContextReturn = {
  setBridgeInfo: Dispatch<any>;
  bridgeInfo: any;
};

export const BridgeContext = createContext<UseBridgeContextReturn>(
  {} as UseBridgeContextReturn
);

export enum BridgeType {
  CreateVaultDepositFromBridgedUSDC = "CreateVaultDepositFromBridgedUSDC",
}

export const BridgeProvider: FC<StakingProviderType> = ({ children }) => {
  const [bridgeInfo, setBridgeInfo] = useState<number>(0);

  const values = useMemo(() => {
    return {
      bridgeInfo,
      setBridgeInfo,
    };
  }, [bridgeInfo, setBridgeInfo]);

  return (
    <BridgeContext.Provider value={values}>{children}</BridgeContext.Provider>
  );
};

const useBridgeContext = () => useContext(BridgeContext);

export default useBridgeContext;
