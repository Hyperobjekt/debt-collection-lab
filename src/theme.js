import { createMuiTheme } from "@material-ui/core/styles";
import { deepmerge } from "@material-ui/utils";

export const COLORS = {
  primary: "#EA4A2E",
  secondary: "#595247",
  paper: "#FAFAF5",
  default: "#fff",
  text: "#1A1716",
  secondaryText: "#595247",
  altBackground: "#FAFAF5",
  darkBackground: "#181817",
  footerBackground: "#181817",
};

export const FONTS = {
  KNOCKOUT: {
    Featherweight: {
      fontFamily: '"Knockout 48 A", "Knockout 48 B", "Oswald", "sans-serif"',
      fontStyle: "normal",
      fontWeight: 400,
    },
    Lightweight: {
      fontFamily: '"Knockout 49 A", "Knockout 49 B", "Oswald", "sans-serif"',
      fontStyle: "normal",
      fontWeight: 400,
    },
    Middleweight: {
      fontFamily: '"Knockout 51 A", "Knockout 51 B", "Oswald", "sans-serif"',
      fontStyle: "normal",
      fontWeight: 400,
    },
    FullMiddleweight: {
      fontFamily: '"Knockout 71 A", "Knockout 71 B", "Oswald", "sans-serif"',
      fontStyle: "normal",
      fontWeight: 400,
    },
  },
  MAPLE: {
    Black: {
      fontFamily: "maple-web, sans-serif",
      fontWeight: 900,
    },
    Bold: {
      fontFamily: "maple-web, sans-serif",
      fontWeight: 700,
    },
    Medium: {
      fontFamily: "maple-web, sans-serif",
      fontWeight: 500,
    },
    Regular: {
      fontFamily: "maple-web, sans-serif",
      fontWeight: 400,
    },
  },
};

/** Spacing function for margins / padding */
export const spacing = (factor) => `${0.5 * factor}rem`;

/** Create theme */
let theme = createMuiTheme({
  palette: {
    primary: {
      main: COLORS.primary,
    },
    secondary: {
      main: COLORS.secondary,
    },
    text: {
      primary: COLORS.text,
      secondary: COLORS.secondaryText,
      light: "#fff",
    },
    background: {
      default: COLORS.default,
      paper: COLORS.paper,
      dark: COLORS.darkBackground,
      alt: COLORS.altBackground,
      footer: COLORS.footerBackground,
    },
    action: {
      hover: "rgba(120, 120, 0, 0.05)",
    },
  },
  spacing,
  shape: { borderRadius: 0 },
  typography: {
    ...FONTS.MAPLE["Regular"],
  },
});

const overrides = {
  /** Site wide global style overrides */
  MuiCssBaseline: {
    "@global": {
      html: {
        scrollBehavior: "smooth",
      },
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
    h1: { fontSize: `4.209rem`, ...FONTS.KNOCKOUT["Middleweight"] },
    h2: { fontSize: `3.157rem`, ...FONTS.KNOCKOUT["Middleweight"] },
    h3: { fontSize: `2.369rem`, ...FONTS.KNOCKOUT["Middleweight"] },
    h4: { fontSize: `1.777rem`, ...FONTS.KNOCKOUT["Middleweight"] },
    h5: { fontSize: `1.333rem`, ...FONTS.KNOCKOUT["Middleweight"] },
    h6: { fontSize: `1rem`, ...FONTS.KNOCKOUT["Middleweight"] },
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
      color: theme.palette.primary.main,
    },
  },
  MuiButton: {
    root: {
      paddingTop: 8,
      fontWeight: 400,
      textTransform: "none",
      fontSize: theme.typography.pxToRem(16),
    },
    contained: {
      boxShadow: "none",
      fontSize: theme.typography.pxToRem(14),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      "& $primary": {
        background: "#000",
      },
    },
    containedPrimary: {
      // accessibility fix: darker to improve contrast
      backgroundColor: "#D2452D",
    },
    text: {
      fontWeight: 400,
      textTransform: "none",
      // accessibility fix: darker to improve contrast
      color: "#CA432B",
    },
    textPrimary: {
      // accessibility fix: darker to improve contrast
      color: "#CA432B",
    },
  },
  MuiDivider: {
    root: {
      backgroundColor: "#eee",
    },
  },
  MuiTooltip: {
    tooltip: {
      backgroundColor: theme.palette.background.dark,
      padding: theme.spacing(2),
      "& a": {
        color: "#fff",
        textDecoration: "underline",
      },
    },
    arrow: {
      color: theme.palette.background.dark,
    },
  },
};

export default deepmerge(theme, { overrides });
