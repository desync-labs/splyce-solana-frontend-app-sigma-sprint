import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import useSharedContext from "@/context/shared";
import VaultsNestedNav from "@/components/Vaults/NestedNav";
import BasePageHeader from "@/components/Base/PageHeader";
import VaultsTotalStats from "@/components/Vaults/List/VaultsTotalStats";
import VaultsList from "@/components/Vaults/List/VaultsList";
import VaultFilters from "@/components/Vaults/List/VaultFilters";
import VaultsListMobile from "@/components/Vaults/List/VaultsListMobile";
import useVaultList from "@/hooks/Vaults/useVaultList";
import { EmptyVaultsWrapper } from "@/components/Base/Boxes/StyledBoxes";
import PageContainer from "@/components/Base/PageContainer";

const VaultsOverview = () => {
  const {
    search,
    sortBy,
    isShutdown,
    vaultsLoading,
    vaultPositionsLoading,
    vaultSortedList,
    vaultPositionsList,
    filterCurrentPosition,
    vaultItemsCount,
    vaultCurrentPage,
    setSearch,
    setSortBy,
    handlePageChange,
    handleIsShutdown,
  } = useVaultList();
  const { isMobile } = useSharedContext();

  const [listLoading, setListLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setListLoading(vaultsLoading || vaultPositionsLoading);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [vaultsLoading, vaultPositionsLoading, setListLoading]);

  return (
    <>
      <VaultsNestedNav />
      <PageContainer>
        <BasePageHeader
          title="Vaults"
          description="Explore existing Vaults, and deposit your assets for a sustainable yield."
        />
        <VaultsTotalStats
          positionsList={vaultPositionsList}
          positionsLoading={listLoading}
        />
        {isMobile ? (
          <>
            <VaultFilters
              search={search}
              sortBy={sortBy}
              isShutdown={isShutdown}
              setSearch={setSearch}
              setSortBy={setSortBy}
              handleIsShutdown={handleIsShutdown}
            />
            {vaultSortedList.length === 0 &&
            !(vaultsLoading || vaultPositionsLoading || listLoading) ? (
              <EmptyVaultsWrapper>
                <Typography>
                  No vaults found.{" "}
                  {search && <>Please try a different search criteria.</>}
                </Typography>
              </EmptyVaultsWrapper>
            ) : (
              <VaultsListMobile
                vaults={vaultSortedList}
                isLoading={listLoading}
                filterCurrentPosition={filterCurrentPosition}
                vaultCurrentPage={vaultCurrentPage}
                vaultItemsCount={vaultItemsCount}
                handlePageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <Paper sx={{ padding: 0 }}>
            <VaultFilters
              search={search}
              sortBy={sortBy}
              isShutdown={isShutdown}
              setSearch={setSearch}
              setSortBy={setSortBy}
              handleIsShutdown={handleIsShutdown}
            />
            {vaultSortedList.length === 0 &&
            !(vaultsLoading || vaultPositionsLoading || listLoading) ? (
              <EmptyVaultsWrapper>
                <Typography>
                  No vaults found.{" "}
                  {search && <>Please try a different search criteria.</>}
                </Typography>
              </EmptyVaultsWrapper>
            ) : (
              <VaultsList
                vaults={vaultSortedList}
                isLoading={listLoading}
                filterCurrentPosition={filterCurrentPosition}
                vaultCurrentPage={vaultCurrentPage}
                vaultItemsCount={vaultItemsCount}
                handlePageChange={handlePageChange}
              />
            )}
          </Paper>
        )}
      </PageContainer>
    </>
  );
};

export default VaultsOverview;
