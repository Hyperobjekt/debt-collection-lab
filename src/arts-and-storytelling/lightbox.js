import React from "react";
import { useState } from "react";
import { Block } from "@hyperobjekt/material-ui-website";
import { IconButton, Box, withStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import CloseIcon from "@material-ui/icons/Close";
import Typography from "../components/typography";

const styles = (theme) => ({
  rootDialog: {
    top: "0",
    left: "0",
    position: "fixed",
    zIndex: "9999",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#000",
    "& .MuiBox-root": {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  container: {
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(0, 3),
  },
  prev: {
    color: "#fff",
    border: `1px solid #fff`,
  },
  next: {
    color: "#fff",
    border: `1px solid #fff`,
  },
  // manually size gatsby image wrapper
  image: {
    width: "100%",
    height: "100%",
    marginBottom: theme.spacing(2),
    "&.gatsby-image-wrapper img": {
      height: "auto",
      maxHeight: "100%",
      margin: "auto",
      objectFit: "contain!important", // HACK: make sure placeholder image is not blown up
    },
    // HACK: do not show the image wrapper that adds spacing
    "&.gatsby-image-wrapper > div": {
      display: "none",
    },
  },
  description: {
    textAlign: "center",
    maxWidth: "30em",
  },
  close: {
    color: "#fff",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
});

const Lightbox = ({
  images = [],
  selected,
  setShow,
  show,
  classes,
  ...props
}) => {
  const [index, setIndex] = useState(selected);

  const handleClick = (type, e) => {
    switch (type) {
      case "prev":
        e.stopPropagation();
        index > 0 ? setIndex(index - 1) : setIndex(images.length - 1);
        break;
      case "next":
        e.stopPropagation();
        index < images.length - 1 ? setIndex(index + 1) : setIndex(0);
        break;
      default:
        return;
    }
  };

  return (
    <Dialog
      fullscreen="true"
      open={show}
      onClose={() => setShow({ show: false, index: 0 })}
    >
      <Block
        bgcolor="background.dark"
        color="common.white"
        className={classes.rootDialog}
        {...props}
      >
        <Box className={classes.container}>
          <IconButton
            className={classes.close}
            aria-label="close"
            variant="outlined"
            onClick={(e) => setShow({ show: false, index: 0 })}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            className={classes.prev}
            aria-label="previous"
            onClick={(e) => handleClick("prev", e)}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <Box className={classes.imageContainer}>
            <GatsbyImage
              alt={images[index].alt || " "}
              className={classes.image}
              image={getImage(images[index].full)}
            />
            <Typography className={classes.description} variant="body1">
              {images[index].caption}
            </Typography>
            <Typography variant="caption">{images[index].author}</Typography>
          </Box>
          <IconButton
            className={classes.next}
            aria-label="next"
            onClick={(e) => handleClick("next", e)}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Block>
    </Dialog>
  );
};

export default withStyles(styles)(Lightbox);
