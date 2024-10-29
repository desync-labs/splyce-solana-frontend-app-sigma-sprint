import { FC } from "react";
import MuiInfoIcon from "@mui/icons-material/Info";

export const BaseInfoIcon: FC<{ sx?: Record<string, any> }> = ({ sx }) => (
  <MuiInfoIcon
    sx={{ width: "11px", height: "11px", marginRight: "5px", ...sx }}
  />
);
