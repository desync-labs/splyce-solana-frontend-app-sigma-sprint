import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connection } from "@solana/web3.js";
import { defaultEndpoint } from "@/utils/network";

type StakingProviderType = {
  children: ReactNode;
};

type UseSyncContextReturn = {
  setLastTransactionBlock: Dispatch<number>;
  lastTransactionBlock: number;
};

export const SyncContext = createContext<UseSyncContextReturn>(
  {} as UseSyncContextReturn
);

export const SyncProvider: FC<StakingProviderType> = ({ children }) => {
  const [lastTransactionBlock, setLastTransactionBlock] = useState<number>(0);

  const connection = new Connection(defaultEndpoint, "confirmed");

  useEffect(() => {
    const getLatestSlot = async () => {
      if (connection === null) return;
      const slot = await connection.getSlot();
      setLastTransactionBlock(slot);
      console.log("INIT Last block:", slot);
    };

    getLatestSlot();
  }, [setLastTransactionBlock]);

  useEffect(() => {
    console.log("Last block changed:", lastTransactionBlock);
  }, [lastTransactionBlock]);

  const values = useMemo(() => {
    return {
      lastTransactionBlock,
      setLastTransactionBlock,
    };
  }, [setLastTransactionBlock, lastTransactionBlock]);

  return <SyncContext.Provider value={values}>{children}</SyncContext.Provider>;
};

const useSyncContext = () => useContext(SyncContext);

export default useSyncContext;
