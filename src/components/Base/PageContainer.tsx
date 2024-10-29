import { Box, Container, styled, Typography } from "@mui/material";
import { BaseInfoBox } from "@/components/Base/Boxes/StyledBoxes";
import { BaseInfoIcon } from "@/components/Base/Icons/StyledIcons";

const PageInfoBox = styled(BaseInfoBox)`
  background: #071f2e;
  border: 1px solid #3a4f6a;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 0;
  margin-bottom: 20px;

  & svg {
    fill: #a9e2fb;
  }

  & p {
    color: #a9e2fb;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-bottom: 16px;
    padding: 8px 12px;

    & p {
      font-size: 12px;
    }
  }
`;

const PageContainer = ({ children }) => {
  return (
    <Container>
      <PageInfoBox>
        <BaseInfoIcon />
        <Box flexDirection="column">
          <Typography width="100%">
            This is test launch, use at your own risk
          </Typography>
        </Box>
      </PageInfoBox>
      {children}
    </Container>
  );
};

export default PageContainer;
