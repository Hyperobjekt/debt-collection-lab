import { Navigation } from "@hyperobjekt/material-ui-website";
import { withStyles } from "@material-ui/core";

export default withStyles((theme) => ({
  root: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block"
    }
  },
  list: {
    display: "flex",
    flexDirection: "row",
  },
  link: {
    color: theme.palette.primary.contrastText,
  },
}))(Navigation);