import React from "react";
import clsx from "clsx";
import { default as Header } from "gatsby-theme-hypersite/src/header/header";
import { withStyles } from "@material-ui/core";
import { useLocation } from "@reach/router";

/**
 * Re-uses the theme header but adds a color change
 * when scrolling for the homepage by utilizing the
 * "shrink" functionality.
 */
function DclHeader({ classes, ...props }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { light, ...headerClasses } = classes;
  return (
    <Header
      className={clsx({ [classes.light]: isHome })}
      classes={headerClasses}
      height={64}
      shrink={64}
      shrinkOffset={500}
      {...props}
    />
  );
}

export default withStyles((theme) => ({
  root: {
    boxShadow: "none",
    background: theme.palette.background.dark,
  },
  light: {
    transition: theme.transitions.create(["background-color"]),
    backgroundColor: theme.palette.background.alt,
    boxShadow: "none",
    "& a": {
      color: theme.palette.text.primary,
    },
    "&.HypHeader-shrunk": {
      background: theme.palette.background.dark,
      "& a": {
        color: "#fff",
      },
    },
  },
}))(DclHeader);
