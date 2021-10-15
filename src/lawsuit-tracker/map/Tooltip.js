import React from "react";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";

const styles = (theme) => ({
  root: {
    position: "absolute",
    pointerEvents: "all",
    background: "rgba(0,0,0,0.87)",
    color: "#fff",
    padding: theme.spacing(2),
    transition: "opacity 0.2s ease-in-out",
    transform: "translate(-50%, calc(-100% - 32px))",
    zIndex: 1,
    minWidth: 200,
  },
  arrowDown: {
    position: 'absolute',
    bottom: -9,
    left: 'calc(50% - 6px)',
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    
    borderTop: '10px solid rgba(0,0,0,0.87)',
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
  closeButton: {
    position: "absolute",
    right: "0px",
    top: "0px",
    color: 'white'
  }
});

const Tooltip = ({
  classes,
  className,
  x,
  y,
  title,
  subtitle,
  items,
  method,
  onUnlock,
  ...props
}) => {
  console.log(method)
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
      {method === 'jump' &&
        <>
          <div className={classes.arrowDown}></div>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onUnlock}
          >
            <CloseIcon />
          </IconButton>
        </>
      }
    </div>
  );
};

Tooltip.propTypes = {};

export default withStyles(styles)(Tooltip);
