import { default as Breadcrumb } from "gatsby-theme-hypersite/src/breadcrumb/breadcrumb";
import { fade, withStyles } from "@material-ui/core";

export default withStyles((theme) => ({
  root: {
    background: "transparent",
    position: "absolute",
    width: "100%",
    color: theme.palette.grey[400],
    padding: 0,
    top: 64,
    // TODO: create styles for mobile breadcrumb
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  container: {},
  depth0: {},
  depth1: {
    minWidth: 160,
    "& $link": {
      color: theme.palette.primary.contrastText,
    },
    "& $listItem": {
      background: fade(theme.palette.grey[800], 0.98),
      "&:hover $link, &:focus-within $link": {
        background: fade(theme.palette.primary.main, 0.8),
      },
    },
  },
  list: {},
  listItem: {},
  listItemActive: {},
  link: {
    color: theme.palette.grey[400],
    padding: theme.spacing(2, 1),
    lineHeight: "15px",
  },
  linkActive: {
    fontWeight: "normal",
  },
  separator: {},
  arrow: {},
}))(Breadcrumb);
