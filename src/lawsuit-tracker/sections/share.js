import React from "react";
import { Block } from "@hyperobjekt/material-ui-website/lib/block";
import { Box, Typography, withStyles } from "@material-ui/core";
import TwitterShare from "../../components/twitter";
import { FONTS } from "../../theme";
import FacebookShare from "../../components/facebook";
import { StaticImage } from "gatsby-plugin-image";

const styles = (theme) => ({
  root: {
    padding: theme.spacing(10, 3),
  },
  container: {
    position: "relative",
    background: theme.palette.background.alt,
    maxWidth: 980,
    height: 340,
    padding: theme.spacing(9, 3),
    overflow: "hidden",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(9),
    },
    "& .MuiTypography-root, & .MuiBox-root": {
      position: "relative",
      zIndex: 2,
    },
    "& > $image": {
      position: "absolute",
      right: 0,
      top: -64,
      bottom: 0,
      width: 375,
      minHeight: `100%`,
      opacity: 0.2,
      [theme.breakpoints.up("md")]: {
        opacity: 1,
      },
    },
  },
  title: {
    ...FONTS.KNOCKOUT["Lightweight"],
    marginBottom: theme.spacing(3),
    fontSize: theme.typography.pxToRem(40),
    color: theme.palette.primary.main,
    textTransform: "uppercase",
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.pxToRem(60),
    },
  },
  description: {
    marginBottom: theme.spacing(3),
    maxWidth: "17em",
  },
  share: {
    marginRight: theme.spacing(1),
  },
  image: {},
});

const ShareBlock = ({ classes, title, description, ...props }) => {
  return (
    <Block
      className={classes.root}
      ContainerProps={{
        className: classes.container,
      }}
    >
      <Typography variant="h3" component="h2" className={classes.title}>
        {title}
      </Typography>
      <Typography className={classes.description}>{description}</Typography>
      <Box display="flex" alignItems="center">
        <Typography className={classes.share}>Share this page: </Typography>
        <TwitterShare />
        <FacebookShare />
      </Box>
      <StaticImage
        className={classes.image}
        layout="fixed"
        width={375}
        height={442}
        src="./court-room-clipped.png"
        alt="court room"
      />
    </Block>
  );
};

ShareBlock.defaultProps = {
  title: "Spread the Word",
  description:
    "Help us make visible the practices and indignities long shielded from the light.",
};

export default withStyles(styles)(ShareBlock);
