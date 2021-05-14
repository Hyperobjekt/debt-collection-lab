import React from "react";
import { Typography as MuiTypography, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { forwardRef } from "react";
import { FONTS } from "../theme";

const style = (theme) => ({
  sectionTitle: {
    ...FONTS.KNOCKOUT["Middleweight"],
    fontSize: theme.typography.pxToRem(34),
    lineHeight: 40 / 34,
    [theme.breakpoints.up("md")]: {
      maxWidth: 320,
    },
    "& + .MuiTypography-root": {
      marginTop: theme.spacing(3),
    },
  },
  number: {
    ...FONTS.KNOCKOUT["Middleweight"],
    fontSize: theme.typography.pxToRem(40),
    lineHeight: 1,
    margin: 0,
  },
  numberSecondary: {
    fontWeight: 500,
    fontSize: theme.typography.pxToRem(40),
    lineHeight: 1,
    margin: 0,
  },
  legendLabel: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 500,
  },
  underline: {
    position: "relative",
    ...FONTS.KNOCKOUT["FullMiddleweight"],
    fontSize: theme.typography.pxToRem(48),
    letterSpacing: `0.02em`,
    lineHeight: 70 / 60,
    maxWidth: `8em`,
    marginBottom: `1em`,
    "&:after": {
      content: "''",
      position: "absolute",
      bottom: `-0.75em`,
      left: 0,
      width: `1.75em`,
      height: `0.5em`,
      backgroundImage: `url(/images/underline.svg)`,
      backgroundSize: `contain`,
      backgroundRepeat: `no-repeat`,
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: theme.typography.pxToRem(60),
    },
  },
  grey: {
    color: "#555",
  },
  primary: {
    color: theme.palette.primary.main,
  },
  black: {
    fontWeight: 700,
  },
  bold: {
    fontWeight: 700,
  },
  medium: {
    fontWeight: 500,
  },
  light: {
    fontWeight: 400,
  },
  gutterTop: {
    marginTop: theme.spacing(1),
  },
});

/**
 * Overrides default material UI typography with some additional variants
 */
const Typography = forwardRef(
  (
    { weight, variant, color, gutterTop, classes, className, ...props },
    ref
  ) => {
    const isCustomVariant = Object.keys(classes).indexOf(variant) > -1;
    const isCustomColor = Object.keys(classes).indexOf(color) > -1;
    return (
      <MuiTypography
        ref={ref}
        className={clsx(
          {
            [classes.bold]: weight === "bold",
            [classes.medium]: weight === "medium",
            [classes.light]: weight === "light",
            [classes[variant]]: isCustomVariant,
            [classes[color]]: isCustomColor,
            [classes.gutterTop]: gutterTop,
          },
          className
        )}
        variant={isCustomVariant ? undefined : variant}
        color={isCustomColor ? undefined : color}
        {...props}
      />
    );
  }
);

export default withStyles(style)(Typography);
