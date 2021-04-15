import { withStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { Block } from ".";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch",
    background: theme.palette.background.default,
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  hasImage: {
    "& $container": {
      position: "relative",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
  },
  image: {
    position: "absolute",
    width: 300,
    top: 0,
    bottom: 0,
    margin: "auto",
  },
  imageLeft: {},
  imageRight: {
    marginRight: 276,
    "& $image": {
      right: -276,
    },
  },
  imageTop: {},
  imageBottom: {},
  imageMid: {},
});

const isMatch = (keys, value) => {
  if (!keys || keys.length === 0) return false;
  return keys.indexOf(value) > -1;
};

const Callout = ({
  classes,
  className,
  image,
  alt,
  placement,
  children,
  ...props
}) => {
  const placementKeys = placement && placement.split("-");
  return (
    <Block
      classes={{ root: classes.root, container: classes.container }}
      className={clsx({
        [classes.hasImage]: image,
        [classes.imageLeft]: image && isMatch(placementKeys, "left"),
        [classes.imageRight]: image && isMatch(placementKeys, "right"),
        [classes.imageTop]: image && isMatch(placementKeys, "top"),
        [classes.imageMid]: image && isMatch(placementKeys, "mid"),
        [classes.imageBottom]: image && isMatch(placementKeys, "bottom"),
        className,
      })}
      {...props}
    >
      {children}
      {image && <img className={classes.image} src={image} alt={alt} />}
    </Block>
  );
};

export default withStyles(styles)(Callout);
