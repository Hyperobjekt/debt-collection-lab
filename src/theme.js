import { createMuiTheme } from "@material-ui/core/styles";
import { deepmerge } from "@material-ui/utils";
import { COLORS } from "./constants";

/** Color palette for theme */
const palette = {
  primary: {
    main: COLORS.primary,
  },
  secondary: {
    main: COLORS.secondary,
  },
  text: {
    primary: "#222",
    secondary: "#666",
  },
  background: {
    default: COLORS.default,
    paper: COLORS.paper,
  },
};

/** Spacing function for margins / padding */
const spacing = (factor) => `${0.5 * factor}rem`;

/** Create theme */
let theme = createMuiTheme({
  palette,
  spacing,
});

const overrides = {
  /** Site wide global style overrides */
  MuiCssBaseline: {
    "@global": {
      // update padding and font on <code> elements
      code: {
        padding: theme.spacing(0.25, 1),
        borderRadius: theme.shape.borderRadius,
        fontFamily: ["monospace"].join(","),
      },
      "[data-reach-skip-nav-link]:focus": {
        zIndex: `9999!important`,
      },
    },
  },
  /**
   * Add margins to material UI typography
   * (based on perfect fourth ratio @ https://type-scale.com/)
   */
  MuiTypography: {
    h1: { fontSize: `4.209rem` },
    h2: { fontSize: `3.157rem` },
    h3: { fontSize: `2.369rem` },
    h4: { fontSize: `1.777rem` },
    h5: { fontSize: `1.333rem` },
    h6: { fontSize: `1rem` },
  },
  MuiToolbar: {
    root: {
      [theme.breakpoints.up("sm")]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
  MuiLink: {
    root: {
      color: theme.palette.secondary.main,
    },
  },
};

export default deepmerge(theme, { overrides });
