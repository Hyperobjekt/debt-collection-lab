import { Hero } from "@hyperobjekt/material-ui-website";
import { withStyles } from "@material-ui/core";

export default withStyles((theme) => ({
  root: {
    background: theme.palette.background.dark,
    [theme.breakpoints.up("md")]: {
      minHeight: 500,
    },
    [theme.breakpoints.up("lg")]: {
      minHeight: 600,
    },
  },
  imageWrapper: {},
  image: {},
  container: {},
  gradient: {},
  content: {},
}))(Hero);
