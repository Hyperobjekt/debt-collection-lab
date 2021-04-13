import { Typography as MuiTypography, withStyles } from "@material-ui/core";
import clsx from "clsx";

const style = (theme) => ({
  number: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: 700,
  },
  label: {
    fontSize: theme.typography.pxToRem(11.5),
    letterSpacing: "0.05em",
    fontStyle: "italic",
  },
});

/**
 * Overrides default material UI typography with some additional variants
 */
const Typography = ({ variant, classes, className, ...props }) => {
  const isCustom = Object.keys(classes).indexOf(variant) > -1;
  return (
    <MuiTypography
      className={isCustom ? clsx(classes[variant], className) : className}
      variant={isCustom ? undefined : variant}
      {...props}
    />
  );
};

export default withStyles(style)(Typography);
