import { default as Header } from "gatsby-theme-hypersite/src/header/header";
import { withStyles } from "@material-ui/core";

export default withStyles((theme) => ({
  root: {
    background: theme.palette.background.dark,
    boxShadow: "none",
  },
}))(Header);
