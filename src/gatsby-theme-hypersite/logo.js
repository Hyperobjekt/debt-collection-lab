import React from "react";
import { default as BaseLogo } from "gatsby-theme-hypersite/src/logo";
import { GatsbyLink } from "gatsby-material-ui-components";
import { FONTS } from "../theme";
import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    color: "#fff",
    textDecoration: "none",
    ...FONTS.KNOCKOUT["Middleweight"],
    fontSize: 18,
    letterSpacing: "0.01em",
  }
})

const Logo = ({ ...props }) => {
  return (
    <BaseLogo
      component={GatsbyLink}
      href={undefined}
      to="/"
      {...props}
    />
  );
};

export default withStyles(styles)(Logo);
