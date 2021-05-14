import { withStyles } from "@material-ui/core";
import MobileNavigation from "gatsby-theme-hypersite/src/header/mobile-navigation";

export default withStyles((theme) => ({
  drawer: {
    "& .MuiDrawer-paper": {
      background: theme.palette.background.dark,
    },
    "& .HypNavigation-link": {
      padding: theme.spacing(2, 3),
      fontSize: theme.typography.pxToRem(16),
      color: "#B6AFA4",
      "&[class*='linkActive']": {
        color: "#fff",
      },
    },
  },
  close: {
    color: "#fff",
  },
}))(MobileNavigation);
