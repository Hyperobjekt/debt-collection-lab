import React from "react";
import PropTypes from "prop-types";
import { Block } from "@hyperobjekt/material-ui-website";
import { Typography, withStyles } from "@material-ui/core";
import { FONTS } from "../theme";
const styles = (theme) => ({
  root: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  container: {
    position: "relative",
    padding: theme.spacing(6, 4),
    border: `6px solid #C8C0BF`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      maxWidth: 670,
      minHeight: 300,
    },
    "& h2": {
      ...FONTS.KNOCKOUT["Lightweight"],
      fontSize: theme.typography.pxToRem(36),
      lineHeight: 1,
      letterSpacing: "0.05em",
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.pxToRem(48),
      },
      [theme.breakpoints.up("md")]: {
        fontSize: theme.typography.pxToRem(60),
      },
    },
    "& h2 + p": {
      maxWidth: "12.5em",
      textAlign: "center",
      lineHeight: 24 / 16,
      marginBottom: theme.spacing(3),
    },
  },
});

const AboutUsCallout = (props) => {
  return <Block {...props} />;
};

AboutUsCallout.defaultProps = {};

AboutUsCallout.propTypes = {};

export default withStyles(styles)(AboutUsCallout);
