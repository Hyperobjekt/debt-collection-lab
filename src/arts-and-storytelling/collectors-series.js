import React from "react";
import { Block } from "@hyperobjekt/material-ui-website";
import { Box, GridList, GridListTile, withStyles } from "@material-ui/core";
import { useState } from "react";
import { FONTS } from "../theme";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import Lightbox from './lightbox'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(15, 0, 15),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(12, 0, 10),
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(12, 0, 15),
    },
    overflow: 'hidden'

  },
  container: {
    justifyContent: "flex-start",
    overflow: 'hidden'

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
  images = [],
  classes,
  children,
  ...props
}) => {
  const [lightbox, setLightbox] = useState({show: false, index: null})
  const { root, container } = classes;
  const handleClick = (i, e) => {
    setLightbox({show: true, index: i})
  }
  console.log(images)
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
          {images &&
            images.map((tile, i) => {
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
          images={images}
          selected={lightbox.index}
          setShow={setLightbox}
        />
      }
    </Block>
  );
};

export default withStyles(styles)(CollectorsSeries);
