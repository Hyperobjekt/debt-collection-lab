import React from "react";
import Hero from "../../components/sections/hero";
import Typography from "../../components/typography";
import { Box, Divider, withStyles } from "@material-ui/core";
import { formatInt, formatMonthYear, formatPercent } from "../utils";

const styles = (theme) => ({
  container: {
    alignItems: "end",
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  stat: {
    maxWidth: 160,
    "& + $stat": {
      marginLeft: theme.spacing(3),
    },
    "& .MuiTypography-root:last-child": {
      marginTop: theme.spacing(1),
      lineHeight: 1.5,
      display: "block",
    },
  },
});

const LocationHero = ({
  classes,
  name,
  totalCount,
  percentWithoutRep,
  percentDefault,
  dateRange,
  children,
  ...props
}) => {
  return (
    <Hero ContainerProps={{ className: classes.container }} {...props}>
      <Typography weight="bold" variant="h2">
        {name}
      </Typography>
      <Divider className={classes.divider} />
      <Box display="flex" flexDirection="row">
        <Box className={classes.stat}>
          <Typography variant="numberSecondary">
            {formatInt(totalCount)}
          </Typography>
          <Typography variant="caption">
            lawsuits from {formatMonthYear(dateRange[0])} to{" "}
            {formatMonthYear(dateRange[1])}
          </Typography>
        </Box>
        <Box className={classes.stat}>
          <Typography variant="numberSecondary">
            {formatPercent(percentWithoutRep)}
          </Typography>
          <Typography variant="caption">
            defendants did not have legal representation
          </Typography>
        </Box>
        <Box className={classes.stat}>
          <Typography variant="numberSecondary">
            {formatPercent(percentDefault)}
          </Typography>
          <Typography variant="caption">
            of lawsuits with default judgements
          </Typography>
        </Box>
      </Box>
      <Divider className={classes.divider} />
      {children}
    </Hero>
  );
};

export default withStyles(styles)(LocationHero);
