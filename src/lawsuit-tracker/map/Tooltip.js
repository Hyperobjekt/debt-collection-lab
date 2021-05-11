import React from "react";
import PropTypes from "prop-types";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";
import clsx from "clsx";
const styles = (theme) => ({
  root: {
    position: "absolute",
    pointerEvents: "none",
    background: "#000",
    color: "#fff",
    padding: theme.spacing(2),
    transition: "opacity 0.2s ease-in-out",
    transform: "translate(-50%, calc(-100% - 32px))",
    zIndex: 999,
    minWidth: 200,
  },
  list: {
    borderTop: `1px dotted #ccc`,
    padding: theme.spacing(1, 0, 0, 2),
    margin: theme.spacing(1, 0, 0, 0),
  },
  listItem: {},
  label: {
    fontWeight: 700,
  },
  value: {},
});

const Tooltip = ({
  classes,
  className,
  x,
  y,
  title,
  subtitle,
  items,
  ...props
}) => {
  return (
    <div
      className={clsx(classes.root, className)}
      style={{
        top: y,
        left: x,
      }}
      {...props}
    >
      {title && (
        <Typography weight="bold" variant="body1">
          {title}
        </Typography>
      )}
      {subtitle && <Typography variant="body2">{subtitle}</Typography>}
      {items && items.length > 0 && (
        <ul className={classes.list}>
          {items.map(({ label, value }) => (
            <li className={classes.listItem} key={label}>
              <Typography variant="caption">
                <span className={classes.label}>{label}</span>:{" "}
                <span className={classes.value}>{value}</span>
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Tooltip.propTypes = {};

export default withStyles(styles)(Tooltip);
