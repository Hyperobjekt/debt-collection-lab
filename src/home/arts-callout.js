import React from "react";
import { Block } from "@hyperobjekt/material-ui-website";
import { withStyles } from "@material-ui/core";
import { FONTS } from "../theme";
const styles = (theme) => ({
  root: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    minHeight: 400,
    [theme.breakpoints.up("sm")]: {
      minHeight: 320,
    },
    [theme.breakpoints.up("md")]: {
      minHeight: 500,
    },
    [theme.breakpoints.up("lg")]: {
      justifyContent: "center",
    },
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      alignItems: "flex-start",
    },
    [theme.breakpoints.up("lg")]: {
      width: "auto",
      marginLeft: "15%",
    },
    "& h2, & p, & a": {
      position: "relative",
      zIndex: 5,
    },
    "& h2": {
      ...FONTS.KNOCKOUT["Lightweight"],
      color: theme.palette.primary.main,
      fontSize: theme.typography.pxToRem(36),
      lineHeight: 1,
      letterSpacing: "0.04em",
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.pxToRem(48),
      },
      [theme.breakpoints.up("md")]: {
        fontSize: theme.typography.pxToRem(60),
      },
    },
    "& h2 + p": {
      maxWidth: "23em",
      lineHeight: 24 / 16,
      margin: theme.spacing(1, 0, 2),
      textAlign: "center",
      [theme.breakpoints.up("sm")]: {
        textAlign: "left",
      },
    },
    "& a": {
      marginLeft: theme.spacing(-1),
    },
    "& .arts-bg": {
      position: "static",
      [theme.breakpoints.down("xs")]: {
        opacity: 0.15,
      },
      "& img": {
        position: "absolute",
        right: 0,
        height: "auto",
        top: 0,
        bottom: 0,
        left: "auto",
        width: 480,
        maxHeight: "100%",
        zIndex: 1,
      },
    },
  },
});

const ArtsCallout = (props) => {
  return <Block bgcolor="background.alt" {...props} />;
};

ArtsCallout.defaultProps = {};

ArtsCallout.propTypes = {};

export default withStyles(styles)(ArtsCallout);
