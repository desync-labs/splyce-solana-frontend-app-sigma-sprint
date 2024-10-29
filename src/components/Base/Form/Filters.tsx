import Image from "next/image";
import { styled } from "@mui/material/styles";
import { Select } from "@mui/material";
import { BaseTextField } from "@/components/Base/Form/StyledForm";

import SearchSrc from "assets/svg/search.svg";

export const BaseSearchTextField = styled(BaseTextField)`
  input {
    background: #1f2632;
    height: 42px;
    color: #a9bad0;
    border: 1px solid #3a4f6a;

    &:hover,
    &:focus {
      border: 1px solid #a0adb2;
      box-shadow: ${({ theme }) => theme.palette.action.focus};
    }
  }
`;

export const BaseFormInputLogo = styled(Image)`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 12px;
  left: 9px;
`;

export const SearchFieldLogo = () => {
  return <BaseFormInputLogo src={SearchSrc} alt="search" />;
};

export const BaseSortSelect = styled(Select)`
  width: auto;
  height: 44px;
  min-width: 100px;
  color: #a9bad0;
  background: #1f2632;
  border: 1px solid #3a4f6a !important;
  border-radius: 8px;

  & .MuiSelect-select {
    background-color: transparent !important;
  }

  fieldset {
    border: none;
    outline: none;
  }
`;
