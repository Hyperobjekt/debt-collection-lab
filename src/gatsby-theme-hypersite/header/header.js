import React from "react";
import clsx from "clsx";
import { default as Header } from "gatsby-theme-hypersite/src/header/header";
import { fade, withStyles } from "@material-ui/core";
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
    backgroundColor: "transparent",
    backgroundImage: `linear-gradient(
      180deg,
      ${theme.palette.background.dark},
      ${fade(theme.palette.background.dark, 0.87)} 64px,
      rgba(0,0,0,0) 192px,
      rgba(0,0,0,0) 256px
    )`,
    backgroundSize: "20px 256px",
    backgroundPosition: "0 -192px",
    position: "absolute",
    transition: theme.transitions.create([
      "background-color",
      "background-position",
      "transform",
    ]),
    transform: `translateY(0px)`,
    "& .logo__light": {
      fill: "#1A1716",
    },
    "& .logo__dark": {
      fill: "#FBF9F6",
    },
  },
  stuck: {
    position: "fixed",
    top: -64,
    transform: `translateY(64px)`,
    backgroundPosition: "0 0px",
    "& + .HypHeader-offset": {
      minHeight: `none!important`,
    },
    backdropFilter: `blur(6px)`,
  },
  light: {
    boxShadow: "none",
    "& a, & button": {
      color: theme.palette.text.primary,
    },
    "&.HypHeader-shrunk": {
      backgroundPosition: "0 0px",
      "& a, & button": {
        color: "#fff",
      },
      "& .logo__light": {
        fill: "#1A1716",
      },
      "& .logo__dark": {
        fill: "#FBF9F6",
      },
    },
    offset: {
      minHeight: 0,
      // marginBottom: -64,
    },
    "& .logo__light": {
      fill: "#FBF9F6",
    },
    "& .logo__dark": {
      fill: "#1A1716",
    },
  },
}))(DclHeader);
