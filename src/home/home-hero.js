import React from "react";
import { Hero } from "@hyperobjekt/material-ui-website";
import { Typography, withStyles } from "@material-ui/core";
import { FONTS } from "../theme";
const styles = (theme) => ({
  root: {
    padding: theme.spacing(8, 0),
  },
  container: {
    [theme.breakpoints.up("md")]: {
      justifyContent: "center",
      marginLeft: `calc(-100% / 5)`,
    },
    [theme.breakpoints.up("lg")]: {
      justifyContent: "flex-start",
      marginLeft: `auto`,
    },
  },
  image: {},
  content: {
    position: "relative",
    zIndex: 5,
    [theme.breakpoints.up("lg")]: {
      marginLeft: `8.333%`,
    },
  },
  imageWrapper: {
    position: "absolute",
    objectFit: "contain",
    width: 500,
    left: "auto",
    right: 0,
    opacity: 0.15,
    [theme.breakpoints.up("md")]: {
      opacity: 1,
      top: 0,
      bottom: 0,
      "& .gatsby-image-wrapper": {
        // make image relative to parent
        position: "static",
        // drop aspect ratio padding for gatsby image
        "& > div:first-child": {
          display: "none",
        },
        // size position image on the right
        "& img": {
          height: "81.5%",
          width: "auto",
          left: "auto",
          right: 0,
          top: 0,
          bottom: 0,
          margin: "auto",
        },
      },
    },
  },
  heading: {
    color: theme.palette.primary.main,
    // More than + adults in America
    "& span:nth-child(1), & span:nth-child(3)": {
      display: "block",
      fontSize: "1.9375em",
      lineHeight: 1.2,
      maxWidth: "8.05em",
      ...FONTS.KNOCKOUT["Lightweight"],
      [theme.breakpoints.up("lg")]: {
        fontSize: theme.typography.pxToRem(36),
      },
    },
    // 70 Million
    "& span:nth-child(2)": {
      display: "block",
      fontSize: "3.25em",
      textTransform: "uppercase",
      lineHeight: 1,
      ...FONTS.KNOCKOUT["FullMiddleweight"],
      [theme.breakpoints.up("md")]: {
        fontSize: "6.5em",
        margin: theme.spacing(0, 0, 2, -1),
        transform: `rotate(-3.5deg)`,
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: theme.typography.pxToRem(140),
        marginLeft: "-8.333%",
        marginTop: theme.spacing(-2),
      },
    },
    // adults in america have had...
    "& span:nth-child(3)": {
      [theme.breakpoints.up("md")]: {
        marginLeft: theme.spacing(10),
        maxWidth: "8.5em",
      },
      [theme.breakpoints.up("lg")]: {
        marginLeft: theme.spacing(17),
      },
    },
    // Private debt collector
    "& span:nth-child(4)": {
      display: "block",
      color: theme.palette.text.primary,
      fontSize: "2.125em",
      textTransform: "uppercase",
      lineHeight: 1.2,
      ...FONTS.KNOCKOUT["Featherweight"],
      [theme.breakpoints.up("md")]: {
        fontSize: "2.75em",
        margin: theme.spacing(0.5, 0, 4, 9.5),
        transform: `rotate(-1.25deg)`,
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: theme.typography.pxToRem(50),
        marginLeft: theme.spacing(16.5),
      },
    },
  },
  paragraph: {
    maxWidth: 438,
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(10),
    },
    [theme.breakpoints.up("lg")]: {
      marginLeft: theme.spacing(17),
    },
  },
});

const HomeHero = ({ classes, heading, paragraph, ...props }) => {
  const { image, imageWrapper, root, container, content } = classes;
  return (
    <Hero
      bgcolor="background.alt"
      color="text.primary"
      classes={{ image, root, container, imageWrapper, content }}
      {...props}
    >
      <Typography
        component="h2"
        paragraph
        className={classes.heading}
        dangerouslySetInnerHTML={{ __html: heading }}
      />
      <Typography
        paragraph
        className={classes.paragraph}
        dangerouslySetInnerHTML={{ __html: paragraph }}
      />
    </Hero>
  );
};

HomeHero.defaultProps = {
  heading: `<span>More than</span> <span>70 million</span><span>adults in America have had a debt turned over to a</span> <span>private debt collector</span>`,
  paragraph: `<strong>That’s 1 in 3 adults.</strong> Your child's teacher. The friendly bank cashier. The person just 2 seats away. Millions have had wages garnished or money seized from their bank accounts, and tens of thousands have been summoned to court in a single county. During the process of debt collection, individuals learn that they can be treated as if they have no right to respect or to redress.`,
};

HomeHero.propTypes = {};

export default withStyles(styles)(HomeHero);
