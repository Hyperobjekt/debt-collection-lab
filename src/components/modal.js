import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  withStyles,
  Button,
  Box,
  Grid,
  Divider,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { GatsbyImage, StaticImage } from "gatsby-plugin-image";

export const styles = (theme) => ({
  //styles for content component
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
  divider: {
    margin: "10px 0px"
  },

  //styles for modal component
  button: {
    height: "100%",
    width: "100%",
    textAlign: "left",
    padding: "0px 20px",
    "& .MuiButton-label": {
      justifyContent: "left",
    }
  },
  dialog: {
    maxWidth: theme.typography.pxToRem(555),
  },
  closeButton: {
    position: "absolute",
    right: "0px",
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(18),
  },
  content: {
    padding: theme.spacing(3, 4, 3, 4),
  },
});

const Content = ({
  members,
  selected,
  classes,
  ...props
}) => {

  const [index, setIndex] = React.useState(selected);

  const handleClick = (type, e) => {
    switch (type) {
      case "prev":
        e.stopPropagation();
        index > 0 ? setIndex(index - 1) : setIndex(members.length - 1);
        break;
      case "next":
        e.stopPropagation();
        index < members.length - 1 ? setIndex(index + 1) : setIndex(0);
        break;
      default:
        return;
    }
  };

  return(
    <Box>
      <Box>
        <StaticImage
          layout="fixed"
          width={375}
          height={442}
          alt="court room"
          src={members[selected].headshot_thumbnail}
        />
      </Box>
      <Box>
      <Typography component="p" variant="h5">
        {members[selected].name}
      </Typography>
      <Typography color="gray" variant="body2">
        {members[selected].title}
      </Typography>
      <Divider className={classes.divider}/>
      <Typography variant="body2">
        {members[selected].bio}
      </Typography>
      </Box>
    </Box>
  )
}

const Modal = ({
  classes,
  members,
  className,
  title = "Modal",
  content,
  children,
  DialogProps = {},
  ...props
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const openHandler = (index) => {
    setSelected(index);
    setModalOpen(true);
  }
  const closeHandler = () => setModalOpen(false);

  return (
    <>
      {children && children.map((child, index) => (
        <Grid component="li" item xs={12} sm={6}
          key={index}
          {...props}
        >
          <Button
            onClick={() => openHandler(index)}
            className={classes.button}
          >
            {child}
          </Button>
        </Grid>
      ))}
      <Dialog
        aria-labelledby="modal-title"
        classes={{ paper: classes.dialog }}
        open={modalOpen}
        onClose={closeHandler}
        {...DialogProps}
      >
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={DialogProps.onClose || closeHandler}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent classes={{ root: classes.content }}>
          <Content members={members} selected={selected} classes={classes} />
        </DialogContent>
      </Dialog>
    </>
  );
};

Modal.propTypes = {
  content: PropTypes.any,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default withStyles(styles)(Modal);