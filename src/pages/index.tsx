import { Container, Typography } from "@mui/material";

const MainPage = () => {
  return (
    <Container>
      <Typography>Main Page</Typography>
    </Container>
  );
};

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/vaults",
      permanent: false,
    },
  };
}

export default MainPage;
