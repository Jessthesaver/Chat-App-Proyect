import React from "react";
import { Grid } from "@mui/material";
import gridWrapperStyles from "./styles";

const GridWrapper = ({ children }) => {
  return (
    <Grid item sm={8} sx={gridWrapperStyles}>
      {children}
    </Grid>
  );
};

export default GridWrapper;
