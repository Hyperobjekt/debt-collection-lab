import React from "react";
import Typography from "../../../components/typography";
import { withStyles } from "@material-ui/core";
import Hero from "../../../components/sections/hero";
import Mustache from "mustache";
import { GatsbyImage } from "gatsby-plugin-image";

const styles = (theme) => ({
  container: {
    justifyContent: "flex-start",
  },
  smallText: {
    display: "block",
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 500,
    maxWidth: "15em",
    [theme.breakpoints.up("md")]: {
      fontSize: theme.typography.pxToRem(18),
    },
  },
  numberText: {
    fontSize: theme.typography.pxToRem(60),
    fontWeight: 700,
    [theme.breakpoints.up("md")]: {
      fontSize: theme.typography.pxToRem(100),
    },
    "& + $smallText": {
      maxWidth: "12.75em",
    },
  },
  gradient: {
    backgroundImage: `linear-gradient(90deg, #000, transparent), radial-gradient(transparent 50%, #000)`,
    [theme.breakpoints.down("xs")]: {
      backgroundColor: "rgba(0,0,0,0.65)",
    },
  },
});

const IndexHero = ({
  classes,
  stateCount,
  countyCount,
  lawsuitTotal,
  startDate,
  endDate,
  content,
  image,
  ...props
}) => {
  const context = { stateCount, countyCount, startDate, endDate };
  return (
    <Hero
      classes={{ gradient: classes.gradient }}
      variant="overlay"
      image={<GatsbyImage width="100%" alt="court room" image={image} />}
      ContainerProps={{ className: classes.container }}
      gradient
      {...props}
    >
      <p>
        <Typography className={classes.smallText} component="span">
          {Mustache.render(content.FIRST_LINE, context)}
        </Typography>
        <Typography
          color="primary"
          className={classes.numberText}
          component="span"
        >
          {lawsuitTotal}
        </Typography>
        <Typography className={classes.smallText} component="span">
          {Mustache.render(content.SECOND_LINE, context)}
        </Typography>
      </p>
    </Hero>
  );
};

export default withStyles(styles)(IndexHero);
