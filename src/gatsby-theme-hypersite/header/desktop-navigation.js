import { withStyles } from "@material-ui/core";
import DesktopNavigation from "gatsby-theme-hypersite/src/header/desktop-navigation";

export default withStyles((theme) => ({
  root: {
    boxShadow: "none",
    background: "transparent",
  },
  listItem: {
    background: "transparent",
  },
  link: {
    color: "#B6AFA4",
    letterSpacing: 1,
    "&:hover": {
      textDecoration: "underline",
      textUnderlineOffset: "6px",
    },
  },
  linkActive: {
    fontWeight: "normal",
    textDecoration: "underline",
    textUnderlineOffset: "6px",
    color: "#fff",
  },
}))(DesktopNavigation);
