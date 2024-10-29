import { styled } from "@mui/material/styles";
import { Box, Button, Dialog } from "@mui/material";

export const BaseDialogWrapper = styled(
  Dialog,
  {}
)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: "0 24px 24px",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "0 16px 24px",
    },
  },
  "& .MuiDivider-root": {
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.default,
    padding: "0",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      height: "calc(var(--vh, 1vh) * 100)",
      maxWidth: "100vw",
      maxHeight: "100vh",
      borderRadius: "0",
      margin: "0",
    },
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  color: "#9FADC6",
  fontSize: "14px",
  lineHeight: "20px",
}));

export const BaseDialogContent = styled("div")`
  padding: 0 24px 24px;
`;

export const BaseDialogButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 16px;

  & > button {
    height: 48px;
    font-size: 17px;
    font-weight: 600;
    padding: 8px 32px;

    &:first-of-type {
      width: 118px;
    }
    &:last-child {
      width: calc(100% - 128px);
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    & > button {
      height: 36px;
      font-size: 15px;
      padding: 4px 18px;
    }
  }
`;

export const BaseDialogNavWrapper = styled(Box)`
  border-bottom: 1px solid #314156;
  display: flex;
  align-items: center;
  gap: 36px;
  padding: 0;
  margin-top: -12px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: fit-content;
    padding: 0;
  }
`;

export const BaseDialogNavItem = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  font-size: 20px;
  font-weight: 600;
  text-transform: none;
  color: #d1dae6;
  background: unset;
  border-radius: 0;
  padding: 16px 0;

  &.active {
    color: #cfff81;
    border-bottom: 2px solid #cfff81;
  }

  &:hover {
    background-color: unset;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    width: 100%;
  }
`;
