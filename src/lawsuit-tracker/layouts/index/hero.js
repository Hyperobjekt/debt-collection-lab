import React from "react";
import { Hero } from "@hyperobjekt/material-ui-website";
import Typography from "../../../components/typography";
import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
  container: {
    alignItems: "flex-start",
  },
  smallText: {
    display: "block",
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 500,
    maxWidth: 320,
  },
  numberText: {
    fontSize: theme.typography.pxToRem(100),
    fontWeight: 700,
  },
});

const IndexHero = ({
  classes,
  stateCount,
  countyCount,
  lawsuitTotal,
  startDate,
  endDate,
  ...props
}) => {
  return (
    <Hero
      bgcolor="background.dark"
      ContainerProps={{ className: classes.container }}
      {...props}
    >
      <p>
        <Typography className={classes.smallText} component="span">
          In the {stateCount} states and {countyCount} counties we track, debt
          collectors filed
        </Typography>
        <Typography
          color="primary"
          className={classes.numberText}
          component="span"
        >
          {lawsuitTotal}
        </Typography>
        <Typography className={classes.smallText} component="span">
          lawsuits from {startDate} to {endDate}.
        </Typography>
      </p>
    </Hero>
  );
};

export default withStyles(styles)(IndexHero);
