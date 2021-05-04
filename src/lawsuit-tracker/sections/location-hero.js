import React from "react";
import Typography from "../../components/typography";
import { Box, Divider, withStyles } from "@material-ui/core";
import { formatInt, formatMonthYear, formatPercent } from "../utils";
import Hero from "../../components/sections/hero"

const styles = (theme) => ({
  container: {
    alignItems: "center",
  },
  content: {
    maxWidth: 600,
    marginLeft: "auto",
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
    <Hero
      bgcolor="background.dark"
      ContainerProps={{ className: classes.container }}
      {...props}
    >
      <Box className={classes.content}>
        <Typography weight="bold" variant="h2">
          {name}
        </Typography>
        <Divider className={classes.divider} />
        <Box display="flex" flexDirection="row">
          <Box className={classes.stat}>
            <Typography color="primary" variant="numberSecondary">
              {formatInt(totalCount)}
            </Typography>
            <Typography variant="body2">
              lawsuits from {formatMonthYear(dateRange[0])} to{" "}
              {formatMonthYear(dateRange[1])}
            </Typography>
          </Box>
          <Box className={classes.stat}>
            <Typography color="primary" variant="numberSecondary">
              {formatPercent(percentWithoutRep)}
            </Typography>
            <Typography variant="body2">
              of defendants did not have legal representation
            </Typography>
          </Box>
          <Box className={classes.stat}>
            <Typography color="primary" variant="numberSecondary">
              {formatPercent(percentDefault)}
            </Typography>
            <Typography variant="body2">
              of lawsuits resulted in default judgments
            </Typography>
          </Box>
        </Box>
        <Divider className={classes.divider} />
      </Box>

      {children}
    </Hero>
  );
};

export default withStyles(styles)(LocationHero);
