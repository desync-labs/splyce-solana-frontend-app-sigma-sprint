import { Box, Button, styled } from "@mui/material";

export const BaseTabsWrapper = styled(Box)`
  display: flex;
  border-radius: 12px;
  border: 1px solid #476182;
  background: #3a4f6a;
  padding: 10px 24px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 10px 16px;
  }
`;

export const BaseTabsItem = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  color: #c7d6da;
  background: unset;
  border-radius: 12px;
  border: 1px solid transparent;
  padding: 8px 24px;

  &.active {
    color: #fff;
    border: 1px solid #bbfb5b;
  }

  &:hover {
    background-color: unset;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    width: 100%;
    padding: 8px 16px;
  }
`;
