import Link from "next/link";
import { styled } from "@mui/material";

export const NestedRouteNav = styled("nav")`
  display: flex;
  align-items: center;
  gap: 36px;
  height: 60px;
  width: 100%;
  background: #232e3d;
  border-bottom: 1px solid #3a4f6a;
  padding: 0 40px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const NestedRouteLink = styled(Link)<{ span?: number }>`
  color: #d1dae6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 60px;
  font-size: 17px;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  padding: 0 2px;

  &.active {
    color: ${({ theme }) => theme.palette.primary.main};
    border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
    background: transparent;
  }

  span {
    margin-bottom: 5px;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
    grid-column: span ${({ span }) => (span ? span : 1)};
  }
`;
