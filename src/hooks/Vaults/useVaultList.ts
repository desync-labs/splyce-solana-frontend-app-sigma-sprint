import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLazyQuery, useQuery } from "@apollo/client";
import BigNumber from "bignumber.js";

import { ACCOUNT_VAULT_POSITIONS, VAULTS } from "@/apollo/queries";
import { COUNT_PER_PAGE_VAULT } from "@/utils/Constants";
import { vaultTitle } from "@/utils/Vaults/getVaultTitleAndDescription";
import { getDefaultVaultTitle } from "@/utils/Vaults/getVaultTitleAndDescription";
import { IVault, IVaultPosition, VaultType } from "@/utils/TempData";
import { defaultNetWork } from "@/utils/network";
import { vaultType } from "@/utils/Vaults/getVaultType";
import { getUserTokenBalance, previewRedeem } from "@/utils/TempSdkMethods";
import useSyncContext from "@/context/sync";
import { setTimeout } from "@wry/context";
import {
  USDC_MINT_ADDRESSES,
  USDC_MINT_ADDRESSES_SHARED,
} from "@/utils/addresses";

interface IdToVaultIdMap {
  [key: string]: string | undefined;
}

export enum SortType {
  EARNED = "earned",
  TVL = "tvl",
  STAKED = "staked",
}

const useVaultList = () => {
  const { publicKey } = useWallet();
  const { lastTransactionBlock } = useSyncContext();

  const network = defaultNetWork;

  const [vaultSortedList, setVaultSortedList] = useState<IVault[]>([]);
  const [vaultPositionsList, setVaultPositionsList] = useState<
    IVaultPosition[]
  >([]);
  const [vaultCurrentPage, setVaultCurrentPage] = useState(1);
  const [vaultItemsCount, setVaultItemsCount] = useState(0);

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>(SortType.TVL);
  const [isShutdown, setIsShutdown] = useState<boolean>(false);

  const [vaultPositionsAdditionLoading, setVaultPositionsAdditionLoading] =
    useState<boolean>(false);
  const [vaultPositionsLoading, setVaultsPositionLoading] =
    useState<boolean>(true);

  const {
    data: vaultItemsData,
    loading: vaultsLoading,
    refetch: vaultsRefetch,
    fetchMore,
  } = useQuery(VAULTS, {
    variables: {
      first: COUNT_PER_PAGE_VAULT,
      skip: 0,
      shutdown: isShutdown,
      network,
    },
    context: { clientName: "vaults", network },
    fetchPolicy: "network-only",
  });

  const [loadPositions, { loading: vaultPositionsCollectionLoading }] =
    useLazyQuery(ACCOUNT_VAULT_POSITIONS, {
      context: { clientName: "vaults", network },
      fetchPolicy: "network-only",
      variables: { network, first: 1000 },
    });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVaultsPositionLoading(
        vaultPositionsCollectionLoading || vaultPositionsAdditionLoading
      );
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    vaultPositionsCollectionLoading,
    vaultPositionsAdditionLoading,
    setVaultsPositionLoading,
  ]);

  useEffect(() => {
    if (publicKey) {
      loadPositions({
        variables: { account: publicKey?.toBase58().toLowerCase() },
      }).then((res) => {
        if (
          res.data?.accountVaultPositions &&
          res.data?.accountVaultPositions.length
        ) {
          setVaultPositionsList(res.data?.accountVaultPositions);

          const promises: Promise<any>[] = [];
          setVaultPositionsAdditionLoading(true);

          res.data?.accountVaultPositions.forEach(
            (position: IVaultPosition) => {
              promises.push(
                getUserTokenBalance(publicKey, position.shareToken.id)
              );
            }
          );

          const balancePositionsPromises: Promise<any>[] = [];

          Promise.all(promises).then((balances) => {
            const vaultPositions = res.data.accountVaultPositions.map(
              (position: IVaultPosition, index: number) => {
                BigNumber(balances[index].toString()).isGreaterThan(0)
                  ? balancePositionsPromises.push(
                      previewRedeem(
                        balances[index].toString(),
                        position.vault.id
                      )
                    )
                  : balancePositionsPromises.push(Promise.resolve(0));
                return {
                  ...position,
                  balanceShares: balances[index].toString(),
                };
              }
            );

            Promise.all(balancePositionsPromises).then((values) => {
              const updatedVaultPositions = vaultPositions.map(
                (position: IVaultPosition, index: number) => {
                  return {
                    ...position,
                    balancePosition: BigNumber(
                      values[index].toString()
                    ).toString(),
                  };
                }
              );
              setVaultPositionsList(updatedVaultPositions);
              setVaultPositionsAdditionLoading(false);
            });
          });
        } else {
          setVaultPositionsList([]);
          setVaultPositionsAdditionLoading(false);
        }
      });
    } else {
      setVaultPositionsList([]);
    }
  }, [lastTransactionBlock, publicKey, loadPositions, setVaultPositionsList]);

  useEffect(() => {
    if (lastTransactionBlock) {
      const timer = setTimeout(() => {
        vaultsRefetch();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [lastTransactionBlock, vaultsRefetch]);

  useEffect(() => {
    if (vaultItemsData && vaultItemsData.vaults) {
      sortingVaults(vaultItemsData.vaults);
      setVaultItemsCount(vaultItemsData.vaults.length);
    }
  }, [vaultItemsData]);

  useEffect(() => {
    if (vaultItemsData && vaultItemsData.vaults) {
      sortingVaults(filteringVaultsBySearch(vaultItemsData.vaults));
    }
  }, [sortBy, search, vaultItemsData]);

  useEffect(() => {
    const isShutdown = sessionStorage.getItem("isShutdown");
    const sortBy = sessionStorage.getItem("sortBy");
    setIsShutdown(isShutdown === "true");
    setSortBy(sortBy ? (sortBy as SortType) : SortType.TVL);
  }, [setIsShutdown, setSortBy]);

  useEffect(() => {
    if (sortBy) {
      sessionStorage.setItem("sortBy", sortBy);
    }
  }, [sortBy]);

  /**
   * Sorting vaults by TVL, Earned, Staked
   */
  const sortingVaults = useCallback(
    (vaultData: IVault[]) => {
      let sortedVaults = [...vaultData];
      if (vaultData.length) {
        if (sortBy === SortType.TVL) {
          sortedVaults = sortedVaults.sort((a, b) => {
            const tvlA = Number(a.balanceTokens);
            const tvlB = Number(b.balanceTokens);

            return tvlB - tvlA;
          });
        }
        if (vaultPositionsList.length) {
          const idToVaultIdMap: IdToVaultIdMap = {};

          const sortVaultsByVaultPositionValue = (a: IVault, b: IVault) => {
            const keyA = a.id;
            const keyB = b.id;

            const positionValueA =
              parseFloat(idToVaultIdMap[keyA] as string) || 0;
            const positionValueB =
              parseFloat(idToVaultIdMap[keyB] as string) || 0;

            return positionValueB - positionValueA;
          };

          if (sortBy === SortType.EARNED) {
            vaultPositionsList.forEach((position: IVaultPosition) => {
              const key = position.vault.id;
              idToVaultIdMap[key] = position.balanceProfit;
            });

            sortedVaults = sortedVaults.sort(sortVaultsByVaultPositionValue);
          }

          if (sortBy === SortType.STAKED) {
            vaultPositionsList.forEach((position: IVaultPosition) => {
              const key = position.vault.id;
              idToVaultIdMap[key] = position.balancePosition;
            });

            sortedVaults = sortedVaults.sort(sortVaultsByVaultPositionValue);
          }
        }
      }

      setVaultSortedList(sortedVaults);
    },
    [sortBy, vaultPositionsList]
  );

  const filteringVaultsBySearch = useCallback(
    (vaultList: IVault[]) => {
      /**
       * Reset counters for default vault titles
       */
      let vaultListWithNames = vaultList.map((vault) => {
        const vautData = {
          ...vault,
          name: vaultTitle[vault.id.toLowerCase()]
            ? vaultTitle[vault.id.toLowerCase()]
            : getDefaultVaultTitle(
                vaultType[vault.id.toLowerCase()] || VaultType.DEFAULT,
                USDC_MINT_ADDRESSES.includes(vault.token.id.toLowerCase())
                  ? "USDC"
                  : "tspUSD",
                vault.id.toLowerCase()
              ),
          type: vaultType[vault.id.toLowerCase()] || VaultType.DEFAULT,
          // todo: remove this after graph fix
          token: {
            ...vault.token,
            symbol: USDC_MINT_ADDRESSES.includes(vault.token.id.toLowerCase())
              ? "USDC"
              : "tspUSD",
            name: USDC_MINT_ADDRESSES.includes(vault.token.id.toLowerCase())
              ? "USD Coin"
              : "Test Splyce USD",
          },
          shareToken: {
            ...vault.shareToken,
            symbol: USDC_MINT_ADDRESSES_SHARED.includes(
              vault.shareToken.id.toLowerCase()
            )
              ? "sUSDC"
              : "sstUSD",
            name: USDC_MINT_ADDRESSES_SHARED.includes(
              vault.shareToken.id.toLowerCase()
            )
              ? "Splyce Vault Shares USD Coin"
              : "Splyce Vault Shares Token USD",
          },
        };

        return vautData;
      });

      if (search) {
        vaultListWithNames = vaultListWithNames.filter((vault) =>
          vault.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      return vaultListWithNames;
    },
    [search]
  );

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      fetchMore({
        variables: {
          first: COUNT_PER_PAGE_VAULT,
          skip: (page - 1) * COUNT_PER_PAGE_VAULT,
        },
      });
      setVaultCurrentPage(page);
    },
    [setVaultCurrentPage, fetchMore]
  );

  const filterCurrentPosition = useCallback(
    (vaultId: string) => {
      const filteredPositions = vaultPositionsList.find((position) => {
        return position.vault.id === vaultId;
      });

      return filteredPositions ? filteredPositions : null;
    },
    [vaultPositionsList, vaultPositionsLoading]
  );

  const handleIsShutdown = (newValue: boolean) => {
    if (newValue !== null) {
      sessionStorage.setItem("isShutdown", newValue ? "true" : "false");
      setIsShutdown(newValue);
    }
  };

  return {
    vaultSortedList,
    vaultsLoading,
    vaultPositionsLoading,
    vaultPositionsList,
    vaultCurrentPage,
    vaultItemsCount,
    isShutdown,
    search,
    sortBy,
    handleIsShutdown,
    setSearch,
    setSortBy,
    handlePageChange,
    filterCurrentPosition,
  };
};

export default useVaultList;
