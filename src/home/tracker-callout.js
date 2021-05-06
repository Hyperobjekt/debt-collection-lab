import React from "react";
import PropTypes from "prop-types";
import Callout from "../components/sections/callout";
import { Typography, withStyles } from "@material-ui/core";
import { FONTS } from "../theme";
const styles = (theme) => ({
  root: {
    [theme.breakpoints.down("md")]: {
      paddingBottom: 0,
    },
  },
  container: {
    position: "relative",
    padding: theme.spacing(10, 0),
    background: theme.palette.background.dark,
    color: "#fff",
    [theme.breakpoints.up("md")]: {
      minHeight: 500,
    },
    "& h2": {
      ...FONTS.KNOCKOUT["Lightweight"],
      fontSize: theme.typography.pxToRem(38),
      lineHeight: 1,
      letterSpacing: "0.02em",
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.pxToRem(56),
      },
      [theme.breakpoints.up("md")]: {
        fontSize: theme.typography.pxToRem(80),
      },
    },
    "& h2 + p": {
      maxWidth: "23em",
      textAlign: "center",
      letterSpacing: "0.01em",
      lineHeight: 30 / 20,
      marginBottom: theme.spacing(4),
      [theme.breakpoints.up("md")]: {
        fontSize: theme.typography.pxToRem(20),
      },
    },
    "& .tracker-bg": {
      position: "static",
      "& img": {
        position: "absolute",
        right: 0,
        height: "100%",
        top: 0,
        bottom: 0,
        left: "auto",
        width: "480px",
      },
    },
  },
});

const TrackerCallout = (props) => {
  return <Callout {...props} />;
};

TrackerCallout.defaultProps = {};

TrackerCallout.propTypes = {};

export default withStyles(styles)(TrackerCallout);
