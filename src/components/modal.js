import React from "react";
import PropTypes from "prop-types";
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
import "focus-visible";
import clsx from "clsx";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

export const styles = (theme) => ({
  //styles for content component
  divider: {
    margin: "10px 0px"
  },
  vertDivider: {
    margin: 0
  },
  bioBox:{
    display: "flex",
    flexDirection: "column",
  },
  btnFlexBox: {
    flexGrow: 1,
    justifyContent: "right",
    display: "flex"
  },
  btnContainerBox: {
    display: 'flex',
    height: 'fit-content',
    marginTop: 'auto',
  },
  contentButton: {
    color: theme.palette.secondary.main,
    fontSize: theme.typography.pxToRem(16),
  },

  //styles for modal component
  jsFocusVisible:{

  },
  focusVisible: {
    
  },
  buttonTrigger: {
    height: "100%",
    width: "100%",
    textAlign: "left",
    padding: "0px 1rem",
    alignItems: "unset",
    color: theme.palette.text.primary,  
    "& .MuiButton-label": {
      justifyContent: "left",
    },
    "&:hover, &:focus:not(.focus-visible)": {
      "& p:first-of-type":{
        textDecoration: "underline"
      },      
      backgroundColor: "transparent",
      "& svg": {
        "& circle": {
          fill: theme.palette.action.expandBio,
        },
        "& rect":{
          fill: "white",
        },
      }
    }
  },
  dialog: {
    maxWidth: theme.typography.pxToRem(900),
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
  title: {
    color: theme.palette.text.primary
  },
  creds: {
    color: theme.palette.text.secondary
  },
});

const Content = ({
  members,
  selected,
  classes,
  ...props
}) => {

  const [index, setIndex] = React.useState(selected);

  const handleClick = (type) => {
    switch (type) {
      case "prev":
        index > 0 ? setIndex(index - 1) : setIndex(members.length - 1);
        break;
      case "next":
        index < members.length - 1 ? setIndex(index + 1) : setIndex(0);
        break;
      default:
        return;
    }
  };

  return(
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <GatsbyImage
          layout="fixed"
          alt="court room"
          image={getImage(members[index].headshot)}
        />
      </Grid>
      <Grid className={classes.bioBox} item xs={12} sm={8}>
        <Typography component="p" variant="h4">
          {members[index].name}
        </Typography>
        <Typography className={classes.creds} variant="body2">
          {members[index].role} | {members[index].title}
        </Typography>
        <Divider className={classes.divider}/>
        <Typography variant="body2">
          {members[index].bio}
        </Typography>
        <Box className={classes.btnFlexBox}>
          <Box className={classes.btnContainerBox}>
            <Button className={classes.contentButton} startIcon={<NavigateBeforeIcon />} onClick={() => handleClick('prev')}>Previous Bio</Button>
            <Divider className={classes.vertDivider} flexItem orientation="vertical" variant="middle" />
            <Button className={classes.contentButton} endIcon={<NavigateNextIcon />} onClick={() => handleClick('next')}>Next Bio</Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
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
            focusRipple={false}
            onClick={() => openHandler(index)}
            className={clsx("focus-visible", classes.buttonTrigger)}
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