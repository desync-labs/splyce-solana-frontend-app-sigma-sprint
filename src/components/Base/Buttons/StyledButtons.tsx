import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  IconButton as MuiButton,
  ToggleButtonGroup,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

export const WalletButton = styled(Button)`
  color: #183102;
  background: ${({ theme }) => theme.palette.gradients.primary};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  border-radius: 8px;
  height: 36px;
  padding: 8px 16px;
  &:hover {
    background: transparent;
    color: ${({ theme }) => theme.palette.primary.main};
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
    cursor: pointer;
    pointer-events: all !important;
    svg {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;

export const BaseButtonSecondary = styled(MuiButton)`
  color: #a0f2c4;
  font-weight: bold;
  font-size: 15px;
  line-height: 20px;
  padding: 8px 16px;
  gap: 8px;
  border: 1px solid #a0f2c4;
  border-radius: 8px;
  height: 40px;
  &:hover {
    background: transparent;
    color: #B3FFF9;
    border: 1px solid #B3FFF9;
    svg {
      color: #B3FFF9;
    }, 
  }
  &:disabled {
    color: gray;
    background: transparent;
    border-color: gray;
    cursor: not-allowed !important;
    pointer-events: all !important; 
  }
`;

export const BaseButtonSecondaryLink = styled("a")`
  display: flex;
  align-items: center;  
  color: #a0f2c4;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  padding: 8px 16px;
  gap: 8px;
  border: 1px solid #a0f2c4;
  border-radius: 8px;
  height: 36px;
  &:hover {
    background: transparent;
    color: #B3FFF9;
    border: 1px solid #B3FFF9;
    svg {
      color: #B3FFF9;
    }, 
  }
  &:disabled {
    color: gray;
    background: transparent;
    border-color: gray;
    cursor: not-allowed !important;
    pointer-events: all !important; 
  }
  
  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 28px;
    font-size: 11px;
    padding: 8px;
  }
`;

export const ExtLinkIcon = styled(OpenInNewRoundedIcon, {
  shouldForwardProp: (prop) => prop !== "scroll",
})<{ width?: string; height?: string }>`
  width: ${({ width = "16px" }) => width};
  height: ${({ height = "16px" }) => height};
  color: ${({ theme }) => theme.palette.primary.main};
  margin-left: 4px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: 0;
  }
`;

export const BaseToggleButtonGroup = styled(ToggleButtonGroup)`
  gap: 8px;
  width: 100%;

  & .MuiToggleButton-root {
    height: 36px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 6px;
    background: rgba(81, 109, 115, 0.4);
    padding: 4px 8px;
    width: 25%;

    &.Mui-selected {
      font-weight: 600;
    }
  }
`;

export const BaseButtonsSwitcherGroup = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: stretch;
  width: 100%;
  height: fit-content;
  background: #051926;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
`;

export const BaseSwitcherButton = styled(MuiButton)`
  align-items: center;
  height: 40px;
  width: calc(50% - 4px);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: transparent;
  &.active {
    background: #072a40;
  }
`;
