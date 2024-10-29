import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const FlexBox = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

export const MainBox = styled(Box)`
  min-height: calc(var(--vh, 1vh) * 100 - 125px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  overflow: auto;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    min-height: calc(var(--vh, 1vh) * 100 - 193px);
  }
`;

export const BaseInfoBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-top: 16px;

  svg {
    height: 20px;
    width: 20px;
    color: #d1dae6;
    margin: 0;
  }

  p {
    color: #d1dae6;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BaseWarningBox = styled(Box)`
  background: #452508;
  border: 1px solid #5c310a;
  border-radius: 8px;
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;

  svg {
    color: #f7b06e;
  }

  p {
    color: #f7b06e;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BaseErrorBox = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(51, 13, 13, 0.9);
  border: 1px solid #5a0000;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 16px;

  svg {
    width: 20px;
    height: 20px;
    color: #f04242;
    float: left;
    margin-right: 10px;
  }
  p {
    color: #f76e6e;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const EmptyVaultsWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
`;
