import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import { deepmerge } from "@material-ui/utils";

/** Color palette for theme */
const palette = {
  primary: {
    main: purple[500],
  },
  secondary: {
    main: green[500],
  },
  text: {
    primary: "#222",
    secondary: "#666",
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
};

export default deepmerge(theme, { overrides });
