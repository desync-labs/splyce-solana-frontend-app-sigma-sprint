import { Dispatch, FC, memo, SetStateAction } from "react";
import { MenuItem, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  BaseSearchTextField,
  BaseSortSelect,
  SearchFieldLogo,
} from "@/components/Base/Form/Filters";
import { FlexBox } from "@/components/Base/Boxes/StyledBoxes";
import { SortType } from "@/utils/TempData";
import useSharedContext from "@/context/shared";

const SearchFieldWrapper = styled(Box)`
  position: relative;
  flex: 1 1 50%;
`;

export type VaultFiltersPropsType = {
  isShutdown: boolean;
  search: string;
  sortBy: SortType;
  handleIsShutdown: (value: boolean) => void;
  setSearch: Dispatch<SetStateAction<string>>;
  setSortBy: Dispatch<SetStateAction<SortType>>;
};

const VaultFilters: FC<VaultFiltersPropsType> = ({
  isShutdown,
  search,
  sortBy,
  handleIsShutdown,
  setSearch,
  setSortBy,
}) => {
  const { isMobile } = useSharedContext();
  return (
    <FlexBox
      sx={{
        width: "100%",
        justifyContent: "space-between",
        padding: isMobile ? "0 0 16px 0" : "16px 24px 24px",
      }}
    >
      <SearchFieldWrapper>
        <BaseSearchTextField
          id="outlined-helperText"
          placeholder="Search by Vault, token name or token address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SearchFieldLogo />
      </SearchFieldWrapper>
      <BaseSortSelect
        value={isShutdown ? "finished" : "live"}
        onChange={(event: SelectChangeEvent<unknown>) => {
          handleIsShutdown(event.target.value !== "live");
        }}
      >
        <MenuItem value={"live"}>Live Now</MenuItem>
        <MenuItem value={"finished"}>Finished</MenuItem>
      </BaseSortSelect>
      <BaseSortSelect
        value={sortBy}
        onChange={(event: SelectChangeEvent<unknown>) => {
          setSortBy(event.target.value as SortType);
        }}
      >
        <MenuItem value={SortType.TVL}>TVL</MenuItem>
        <MenuItem value={SortType.EARNED}>Earned</MenuItem>
        <MenuItem value={SortType.STAKED}>Staked</MenuItem>
      </BaseSortSelect>
    </FlexBox>
  );
};

export default memo(VaultFilters);
