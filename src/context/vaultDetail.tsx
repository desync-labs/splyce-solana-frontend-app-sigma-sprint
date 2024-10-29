import {
  createContext,
  Dispatch,
  FC,
  memo,
  ReactElement,
  SetStateAction,
  useContext,
} from "react";
import useVaultDetail, {
  IVaultStrategyHistoricalApr,
  VaultInfoTabs,
} from "hooks/Vaults/useVaultDetail";
import { IVault, IVaultPosition, IVaultStrategyReport } from "@/utils/TempData";

export type VaultContextType = {
  children: ReactElement;
};

export type UseVaultContextReturnType = {
  vault: IVault;
  vaultAddress: string;
  vaultLoading: boolean;
  vaultPosition: IVaultPosition;
  reports: Record<string, IVaultStrategyReport[]>;
  historicalApr: Record<string, IVaultStrategyHistoricalApr[]>;
  balanceEarned: number;
  balanceToken: string;
  performanceFee: number;
  activeVaultInfoTab: VaultInfoTabs;
  vaultMethods: FunctionFragment[];
  strategyMethods: FunctionFragment[];
  setActiveVaultInfoTab: Dispatch<SetStateAction<VaultInfoTabs>>;
  managedStrategiesIds: string[];
  isUserManager: boolean;
  isReportsLoaded: boolean;
  isUserKycPassed: boolean;
  isTfVaultType: boolean;
  tfVaultDepositEndDate: string | null;
  tfVaultLockEndDate: string | null;
  tfVaultDepositLimit: string;
  activeTfPeriod: number;
  minimumDeposit: number;
  setMinimumDeposit: Dispatch<SetStateAction<number>>;
  handleWithdrawAll: () => void;
  isWithdrawAllLoading: boolean;
  tfVaultDepositEndTimeLoading: boolean;
  tfVaultLockEndTimeLoading: boolean;
  showWithdrawAllButton: boolean;
  isShowWithdrawAllButtonLoading: boolean;
  setActiveVaultInfoTabHandler: (value: VaultInfoTabs) => void;
};

export const VaultContext = createContext<UseVaultContextReturnType>(
  {} as UseVaultContextReturnType
);

export const VaultProvider: FC<VaultContextType> = memo(({ children }) => {
  const values = useVaultDetail();

  return (
    <VaultContext.Provider value={values}>{children}</VaultContext.Provider>
  );
});

const useVaultContext = () => useContext(VaultContext);

export default useVaultContext;
