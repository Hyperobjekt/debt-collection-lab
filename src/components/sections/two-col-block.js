import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Block } from ".";

const StyledBlock = withStyles((theme) => ({
  root: {
    position: "relative",
    "& .MuiGrid-root.MuiGrid-item:first-child": {
      paddingRight: theme.spacing(6),
    },
    "& img": {
      maxWidth: "100%",
    },
  },
}))(Block);

const TwoColBlock = ({ left, right, ...props }) => {
  return (
    <StyledBlock {...props}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {left}
        </Grid>
        <Grid item xs={12} md={8}>
          {right}
        </Grid>
      </Grid>
    </StyledBlock>
  );
};

export default TwoColBlock;
