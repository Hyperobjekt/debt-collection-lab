import { Hero } from "@hyperobjekt/material-ui-website"
import { withStyles } from "@material-ui/core"

export default withStyles((theme) => ({
  root: {
    background: theme.palette.background.dark,
    [theme.breakpoints.up("md")]: {
      minHeight: 500
    }
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  }
}))(Hero)