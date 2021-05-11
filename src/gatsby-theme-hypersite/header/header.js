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
      stickyOffset={500}
      shrink={64}
      shrinkOffset={500}
      {...props}
    />
  );
}

export default withStyles((theme) => ({
  root: {
    boxShadow: "none",
    background: "transparent",
    position: "absolute",
    transition: theme.transitions.create(["background-color", "transform"]),
    transform: `translateY(0px)`,
  },
  stuck: {
    position: "fixed",
    top: -64,
    transform: `translateY(64px)`,
    backgroundColor: theme.palette.background.dark,
    "& + .HypHeader-offset": {
      minHeight: `none!important`,
    },
  },
  light: {
    boxShadow: "none",
    "& a, & button": {
      color: theme.palette.text.primary,
    },
    "&.HypHeader-shrunk": {
      background: theme.palette.background.dark,
      "& a, & button": {
        color: "#fff",
      },
    },
    offset: {
      minHeight: 0,
      // marginBottom: -64,
    },
  },
}))(DclHeader);
