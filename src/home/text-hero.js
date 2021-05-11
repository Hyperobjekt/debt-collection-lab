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
  container: {},
  image: {},
  content: {
    position: "static",
    "& p": {
      ...FONTS.KNOCKOUT["FullMiddleweight"],
      letterSpacing: "0.02em",
      color: "#976A2b",
      maxWidth: "15em",
      fontSize: theme.typography.pxToRem(28),
      lineHeight: 70 / 60,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.pxToRem(36),
      },
      [theme.breakpoints.up("md")]: {
        fontSize: theme.typography.pxToRem(48),
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: theme.typography.pxToRem(60),
      },
    },
    "& .cent": {
      width: 80,
      position: "absolute",
      top: 24,
      left: -24,
      [theme.breakpoints.up("md")]: {
        width: 100,
      },
    },
    "& .chain": {
      width: 180,
      position: "absolute",
      bottom: 0,
      right: -24,
      [theme.breakpoints.up("md")]: {
        width: 265,
      },
    },
  },
  imageWrapper: {},
});

const TextHero = ({ classes, ...props }) => {
  const { image, imageWrapper, root, container, content, gradient } = classes;
  return (
    <Hero
      bgcolor="background.default"
      classes={{ image, root, container, imageWrapper, content, gradient }}
      {...props}
    />
  );
};

export default withStyles(styles)(TextHero);
