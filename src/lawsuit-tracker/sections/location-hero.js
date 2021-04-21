import React from "react";
import Hero from "../../components/sections/hero";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
  container: {
    alignItems: "end",
  },
});

const LocationHero = ({
  classes,
  name,
  totalCount,
  percentWithoutRep,
  percentComparison,
  children,
  ...props
}) => {
  return (
    <Hero ContainerProps={{ className: classes.container }} {...props}>
      <Typography variant="h2">{name}</Typography>
      <Typography>{totalCount} lawsuits</Typography>
      <Typography>{percentWithoutRep} without representation</Typography>
      <Typography>{percentComparison} compared to average</Typography>
      {children}
    </Hero>
  );
};

export default withStyles(styles)(LocationHero);
