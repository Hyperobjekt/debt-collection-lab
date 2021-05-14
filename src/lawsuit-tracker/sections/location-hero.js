import React from "react";
import Typography from "../../components/typography";
import { Box, Divider, withStyles } from "@material-ui/core";
import { formatInt, formatMonthYear, formatPercent } from "../utils";
import Hero from "../../components/sections/hero";
import Mustache from "mustache";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import TwitterShare from "../../components/twitter";
import FacebookShare from "../../components/facebook";

const styles = (theme) => ({
  root: {
    minHeight: 500,
    [theme.breakpoints.up("lg")]: {
      minHeight: 600,
    },
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  content: {
    position: "relative",
    zIndex: 2,
    flex: 1,
    [theme.breakpoints.up("sm")]: {
      marginLeft: "auto",
      maxWidth: "53.4%",
      width: "100%",
      minWidth: 500,
    },
  },
  imageWrapper: {
    position: "absolute",
    left: 0,
    bottom: 16,
    zIndex: 1,
    width: 250,
    [theme.breakpoints.up("md")]: {
      bottom: 32,
    },
    [theme.breakpoints.up("lg")]: {
      bottom: 64,
    },
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  statsWrapper: {
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
  },
  stat: {
    maxWidth: 160,
    "& + $stat": {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.up("sm")]: {
      "& + $stat": {
        marginTop: 0,
        marginLeft: theme.spacing(3),
      },
    },
    "& .MuiTypography-root:last-child": {
      marginTop: theme.spacing(1),
      lineHeight: 1.5,
      display: "block",
    },
  },
  share: {
    marginTop: theme.spacing(-2),
    "& .MuiTypography-root:first-child": {
      marginRight: theme.spacing(1),
    },
    "& .MuiSvgIcon-root": {
      fontSize: 16,
    },
  },
});

const FORMATTERS = {
  lawsuits: formatInt,
  no_rep_percent: formatPercent,
  default_judgement: formatInt,
  default_judgement_percent: formatPercent,
};

const LocationHero = ({
  classes,
  data,
  image,
  content,
  children,
  ...props
}) => {
  const { name, dateRange } = data;
  const isIndiana = data.name === "Indiana" || data.state === "Indiana";
  const context = {
    startDate: formatMonthYear(dateRange[0]),
    endDate: formatMonthYear(dateRange[1]),
  };
  return (
    <Hero
      classes={{
        root: classes.root,
        imageWrapper: classes.imageWrapper,
        content: classes.content,
      }}
      bgcolor="background.dark"
      image={
        <GatsbyImage width="50%" image={getImage(image)} alt="ball and chain" />
      }
      ContainerProps={{ className: classes.container }}
      {...props}
    >
      <Typography weight="bold" variant="h2">
        {name}
      </Typography>
      <Divider className={classes.divider} />
      <Box
        className={classes.statsWrapper}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {content.STATS.map((stat) => {
          const format = FORMATTERS[stat.id];
          const value = format(data[stat.id]);
          return isIndiana && stat.id.indexOf("default_judgement") > -1 ? (
            <Box key={stat.id} className={classes.stat}>
              <Typography color="primary" variant="numberSecondary">
                -
              </Typography>
              <Typography variant="body2">
                default judgements are unavailable in Indiana
              </Typography>
            </Box>
          ) : (
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
      <Box display="flex" alignItems="center" className={classes.share}>
        <Typography variant="caption">Share this page: </Typography>
        <TwitterShare />
        <FacebookShare />
      </Box>
      {children}
    </Hero>
  );
};

export default withStyles(styles)(LocationHero);
