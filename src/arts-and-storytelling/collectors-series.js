import React, { useEffect } from "react";
import { Block } from "@hyperobjekt/material-ui-website";
import { Box, GridList, GridListTile, withStyles } from "@material-ui/core";
import { useState } from "react";
import { FONTS } from "../theme";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import Lightbox from './lightbox'
import useScrollPosition from "./hooks/useScrollPosition";

const styles = (theme) => ({
  root: {
    padding: theme.spacing(15, 0, 15),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(12, 0, 10),
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(12, 0, 15),
    },
  },
  container: {
    justifyContent: "flex-start",
  },
  content: {
    position: "relative",
    paddingRight: `7.6125%`,
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      maxWidth: 1060,
    },
    "& > h2": {
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
      [theme.breakpoints.up("md")]: {
        maxWidth: `5em`,
        fontSize: theme.typography.pxToRem(60),
        [theme.breakpoints.up("md")]: {
          position: "absolute",
          left: 0,
          top: `-0.15em`,
        },
      },
    },
    "& > p": {
      maxWidth: "30em",
    },
    "& > p + p": {
      marginTop: theme.spacing(3),
    },
  },
  images: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    marginTop: theme.spacing(8),
  },
  gridList: {
    width: "100%",
    maxWidth: 770,
  },
  gridTile: {
    padding: 0,
    "& .gatsby-image-wrapper": {
      height: "100%",
    },
  },
});

const CollectorsSeries = ({
  title,
  description,
  galleryImages = [],
  fullresImages = [],
  classes,
  children,
  ...props
}) => {
  const [lightbox, _setLightbox] = useState({show: false, index: 0})
  const [scrollPosition, setScrollPosition] = useState(0)
  const { root, container } = classes;
  const handleClick = (i, e) => {
    setLightbox({show: true, index: i})
  }

  const setLightbox = (state) => {
    if(state.show === true) setScrollPosition(window.scrollY)
    _setLightbox(state)
  }

  useEffect(() => {
    if(lightbox.show === false){
      window.scrollTo(0, scrollPosition);
    }
  }, [lightbox])

  return (
    <Block
      bgcolor="background.dark"
      color="common.white"
      classes={{ root, container }}
      {...props}
    >
      <Box className={classes.content}>{children}</Box>
      <Box className={classes.images}>
        <GridList
          spacing={40}
          cellHeight={350}
          className={classes.gridList}
          cols={8}
        >
          {galleryImages &&
            galleryImages.map((tile, i) => {
              return (
                <GridListTile
                  key={i}
                  className={classes.gridTile}
                  cols={tile.cols || 1}
                  onClick={(e) => handleClick(i, e)}
                >
                  <GatsbyImage
                    height={350}
                    alt={tile.alt || " "}
                    image={getImage(tile.image)}
                  />
                </GridListTile>
              );
            })}
        </GridList>
      </Box>
      {lightbox.show && 
      <Lightbox 
        images={fullresImages}
        selected={lightbox.index}
        setShow={setLightbox}
        show={lightbox.show}
      />
    }
    </Block>
  );
};

export default withStyles(styles)(CollectorsSeries);
