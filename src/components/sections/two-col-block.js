import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Block } from "@hyperobjekt/material-ui-website";

const StyledBlock = withStyles((theme) => ({
  root: {
    position: "relative",
    padding: theme.spacing(9, 0),
    "& .two-col-block__left": {
      paddingRight: theme.spacing(6),
    },
    "& .two-col-block__right": {
      position: 'relative',
      [theme.breakpoints.up("sm")]: {
        position: 'inherit'
      }
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
        <Grid className="two-col-block__left" item xs={12} md={4}>
          {left}
        </Grid>
        <Grid className="two-col-block__right" item xs={12} md={8}>
          {right}
        </Grid>
      </Grid>
    </StyledBlock>
  );
};

export default TwoColBlock;
