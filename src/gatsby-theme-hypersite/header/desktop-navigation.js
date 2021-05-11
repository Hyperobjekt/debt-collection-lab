import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core";
import DesktopNavigation from "gatsby-theme-hypersite/src/header/desktop-navigation";

export default withStyles((theme) => ({
  root: {
    boxShadow: "none",
    background: "transparent",
  },
  listItem: {
    background: "transparent",
  }
}))(DesktopNavigation);
