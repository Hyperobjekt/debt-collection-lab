import React from "react";
import { Hero } from "@hyperobjekt/material-ui-website";
import { withStyles } from "@material-ui/core";
import { FONTS } from "../theme";

const styles = (theme) => ({
  root: {
    padding: theme.spacing(15, 0, 15),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(12, 0, 10),
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(12, 0, 15),
    },
  },
  container: {
    justifyContent: "flex-start",
  },
  image: {},
  content: {
    position: "static",
    "& > p": {
      maxWidth: "15em",
    },
    "& > p, & > p span": {
      position: "relative",
      zIndex: 2,
      ...FONTS.KNOCKOUT["Lightweight"],
      letterSpacing: "0.02em",
      fontSize: theme.typography.pxToRem(36),
      lineHeight: 70 / 60,
      [theme.breakpoints.up("md")]: {
        fontSize: theme.typography.pxToRem(48),
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: theme.typography.pxToRem(60),
      },
    },
    "& > p .smear": {
      zIndex: 1,
      whiteSpace: "nowrap",
      position: "relative",
      padding: `0em 1em`,
      marginLeft: `-0.75em`,
      marginRight: `-1em`,
      "& > span": {
        position: "relative",
        zIndex: 3,
      },
      "&:before": {
        content: "''",
        position: "absolute",
        top: `0.1em`,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(/images/paint-smear.png)`,
        backgroundSize: `contain`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 1,
      },
    },
    "& .image.image--right": {
      width: 373,
      position: "absolute",
      bottom: 0,
      right: -24,
    },
  },
  imageWrapper: {},
});

const ArtsHero = ({ classes, ...props }) => {
  const { root, container, content, gradient } = classes;
  return (
    <Hero
      bgcolor="background.dark"
      classes={{ root, container, content, gradient }}
      {...props}
    />
  );
};

export default withStyles(styles)(ArtsHero);
