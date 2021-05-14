import React from "react";
import { useState } from "react";
import { Block } from "@hyperobjekt/material-ui-website";
import { IconButton, Box, withStyles } from "@material-ui/core";
import { FONTS } from "../theme";
import Dialog from '@material-ui/core/Dialog';
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import CloseIcon from '@material-ui/icons/Close';
import Typography from "../components/typography";

const styles = (theme) => ({
  rootDialog: 
  {
    top: '0', 
    left: '0', 
    position: 'fixed', 
    zIndex: '9999', 
    height: '100vh', 
    width: '100vw', 
    backgroundColor: '#000',
    '& .MuiBox-root':{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 4rem'
    }
  },
  container: {
    display: 'inline-block',
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prev: {
    width: '48px',
    color: '#fff',
    border: 'solid'
  },
  image: {
    '&.gatsby-image-wrapper img':{
      maxHeight: '100%',
      margin: 'auto'
    }
  },
  next: {
    display: 'inline-block',
    width: '48px',
    color: '#fff',
    transform: 'rotate(180deg)',
    border: 'solid'
  },
  close: {
    color: '#fff',
    position: 'absolute',
    top: '10px',
    right: '10px',
  }
});

const Lightbox = ({
  images = [],
  selected,
  setShow,
  show,
  classes,
  ...props
}) => {

  const [index, setIndex] = useState(selected)

  console.log(show)

  const handleClick = (type, e) => {
    switch(type) {
      case 'prev':
        e.stopPropagation()
        index > 0 ?
        setIndex(index - 1)
        :
        setIndex(images.length - 1)
        break;
      case 'next':
        e.stopPropagation()
        index < images.length - 1 ?
        setIndex(index + 1)
        :
        setIndex(0)
        break;
    }
  }

  return (
    <Dialog fullscreen="true" open={show} onClose={()=>setShow(false)}>
      <Block
        bgcolor="background.dark"
        color="common.white"
        onClick={(e) => handleClick('close', e)}
        className={classes.rootDialog}
        {...props}
      >
        <Box className={classes.container}>
        <IconButton 
          className={classes.close} 
          aria-label="close"
          onClick={(e) => setShow(false)}
          >
            <CloseIcon />
          </IconButton>
          <IconButton 
          className={classes.prev} 
          aria-label="previous"
          onClick={(e) => handleClick('prev', e)}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <Box className={classes.imageContainer}>
            <GatsbyImage
              alt={images[index].alt || " "}
              className={classes.image}
              image={getImage(images[index].image)}
            />
            <Typography weight="light" variant="body1">
              {images[index].desc}
            </Typography>
          </Box>
          <IconButton
            className={classes.next} 
            aria-label="next"
            onClick={(e) => handleClick('next', e)}
          >
            <NavigateBeforeIcon />
          </IconButton>
        </Box>
      </Block>
    </Dialog>
  );
};

export default withStyles(styles)(Lightbox);
