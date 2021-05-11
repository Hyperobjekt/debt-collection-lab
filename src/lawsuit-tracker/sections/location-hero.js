import React from "react";
import Typography from "../../components/typography";
import { Box, Divider, withStyles } from "@material-ui/core";
import { formatInt, formatMonthYear, formatPercent } from "../utils";
import Hero from "../../components/sections/hero";
import Mustache from "mustache";

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

const FORMATTERS = {
  lawsuits: formatInt,
  no_rep_percent: formatPercent,
  default_judgement: formatInt,
  default_judgement_percent: formatPercent,
};

const LocationHero = ({ classes, data, content, children, ...props }) => {
  const { name, dateRange } = data;
  const context = {
    startDate: formatMonthYear(dateRange[0]),
    endDate: formatMonthYear(dateRange[1]),
  };
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
          {content.STATS.map((stat) => {
            const format = FORMATTERS[stat.id];
            const value = format(data[stat.id]);
            return (
              <Box key={stat.id} className={classes.stat}>
                <Typography color="primary" variant="numberSecondary">
                  {value}
                </Typography>
                <Typography variant="body2">
                  {Mustache.render(stat.description, context)}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Divider className={classes.divider} />
      </Box>

      {children}
    </Hero>
  );
};

export default withStyles(styles)(LocationHero);
