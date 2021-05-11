import React from "react";
import { Hero } from "@hyperobjekt/material-ui-website";
import { Typography, withStyles } from "@material-ui/core";
import { FONTS } from "../theme";
const styles = (theme) => ({
  root: {
    [theme.breakpoints.up("md")]: {
      minHeight: 600,
    },
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    [theme.breakpoints.up("md")]: {
      alignItems: "center",
    },
  },
  image: {},
  content: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: "8.333%",
    },
  },
  imageWrapper: {},
  text: {
    // 90% (number)
    "& span:nth-child(1)": {
      display: "block",
      ...FONTS.KNOCKOUT["FullMiddleweight"],
      color: theme.palette.primary.main,
      fontSize: theme.typography.pxToRem(80),
      letterSpacing: `0.02em`,
      lineHeight: 1,
      marginLeft: "-0.03em", // shift number slightly to align
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.pxToRem(140),
      },
    },
    // of debtors summoned to court (descriptor)
    "& span:nth-child(2)": {
      color: "#fff",
      ...FONTS.KNOCKOUT["Middleweight"],
      fontSize: theme.typography.pxToRem(18),
      lineHeight: 34 / 26,
      display: "block",
      maxWidth: "12.5em",
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.pxToRem(26),
      },
    },
  },
  gradient: {
    background: `linear-gradient(90deg, #000, transparent)`,
  },
});

const StatHero = ({ classes, number, description, ...props }) => {
  const { image, imageWrapper, root, container, content, gradient } = classes;
  return (
    <Hero
      bgcolor="background.dark"
      classes={{ image, root, container, imageWrapper, content, gradient }}
      {...props}
    >
      <Typography className={classes.text}>
        <span dangerouslySetInnerHTML={{ __html: number }} />
        <span dangerouslySetInnerHTML={{ __html: description }} />
      </Typography>
    </Hero>
  );
};

StatHero.defaultProps = {
  number: `90%`,
  description: `of debtors summoned to court do not have legal counsel`,
};

StatHero.propTypes = {};

export default withStyles(styles)(StatHero);
