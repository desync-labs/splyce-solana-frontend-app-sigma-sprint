import { FC, ReactNode } from "react";
import { Grid } from "@mui/material";
import useSharedContext from "context/shared";
interface BasePageStatsWrapperProps {
  children: ReactNode;
}

const BasePageStatsWrapper: FC<BasePageStatsWrapperProps> = ({ children }) => {
  const { isMobile } = useSharedContext();

  return (
    <Grid container spacing={isMobile ? 0.5 : 1.5}>
      {children}
    </Grid>
  );
};

export default BasePageStatsWrapper;
