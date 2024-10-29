import ReactPlayer from "react-player";
import { Container, styled } from "@mui/material";
import VaultsNestedNav from "@/components/Vaults/NestedNav";
import BasePageHeader from "@/components/Base/PageHeader";

const EmbedVideoWrapper = styled("div")`
  position: relative;
  padding-top: 50%;
`;

const ResponsiveReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const VaultsTutorial = () => {
  return (
    <>
      <VaultsNestedNav />
      <Container>
        <BasePageHeader title="Tutorials" />
        <EmbedVideoWrapper>
          <ResponsiveReactPlayer
            url={"/videos/vaults/vault-tutorial.mp4"}
            controls={true}
            width="100%"
            height="100%"
          />
        </EmbedVideoWrapper>
      </Container>
    </>
  );
};

export default VaultsTutorial;
