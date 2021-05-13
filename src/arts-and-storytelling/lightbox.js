import React from "react";
import { useState } from "react";
import { Block } from "@hyperobjekt/material-ui-website";
import { IconButton, Box, withStyles } from "@material-ui/core";
import { FONTS } from "../theme";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const styles = (theme) => ({
  root: 
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
    }
  },
  container: {
    display: 'inline-block',
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prev: {
    width: '48px',
    color: '#fff',
  },
  image: {
    width: '1'
  },
  next: {
    display: 'inline-block',
    width: '48px',
    color: '#fff',
    transform: 'rotate(180deg)'
  }
});

const Lightbox = ({
  images = [],
  selected,
  setShow,
  classes,
  ...props
}) => {

  const [index, setIndex] = useState(selected)

  const handleClick = (type, e) => {
    switch(type) {
      case 'close':
        setShow(false);
        break;
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
    <Block
      bgcolor="background.dark"
      color="common.white"
      onClick={(e) => handleClick('close', e)}
      className={classes.root}
      {...props}
    >
      <Box className={classes.container}>
        <IconButton 
        className={classes.prev} 
        aria-label="previous"
        onClick={(e) => handleClick('prev', e)}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <Box className={classes.imageContainer}>
          <GatsbyImage
            className={classes.image}
            image={getImage(images[index].image)}
          />
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
  );
};

export default withStyles(styles)(Lightbox);
