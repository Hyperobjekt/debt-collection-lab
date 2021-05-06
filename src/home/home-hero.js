import React from "react";
import PropTypes from "prop-types";
import { Hero } from "@hyperobjekt/material-ui-website";
import { Typography, withStyles } from "@material-ui/core";
import { FONTS } from "../theme";
const styles = (theme) => ({
  root: {},
  container: {},
  image: {},
  imageWrapper: {},
  heading: {
    color: theme.palette.primary.main,
    "& span:nth-child(1), & span:nth-child(3)": {
      display: "block",
      ...FONTS.KNOCKOUT["Lightweight"],
    },
    "& span:nth-child(2)": {
      display: "block",
      ...FONTS.KNOCKOUT["FullMiddleweight"],
    },
    "& span:nth-child(4)": {
      color: theme.palette.text.primary,
      ...FONTS.KNOCKOUT["Featherweight"],
    },
  },
  paragraph: {
    maxWidth: 438,
  },
});

const HomeHero = ({ classes, heading, paragraph, ...props }) => {
  const { image, imageWrapper, root, container } = classes;
  return (
    <Hero
      bgcolor="background.alt"
      color="text.primary"
      classes={{ image, root, container, imageWrapper }}
      {...props}
    >
      <Typography
        paragraph
        className={classes.heading}
        dangerouslySetInnerHTML={{ __html: heading }}
      />
      <Typography paragraph className={classes.paragraph}>
        {paragraph}
      </Typography>
    </Hero>
  );
};

HomeHero.defaultProps = {
  heading: `<span>More than</span> <span>70 million</span><span>adults in America have had a debt turned over to a</span> <span>private debt collector</span>`,
  paragraph: `That’s 1 in 3 adults. Your child's teacher. The friendly bank cashier. The person just 2 seats away. Millions have been threatened with jail, tens of thousands have been summoned to court in a single county in a single county. The greatest indignities fall on lower-income debtors and on those who are Black or Latinx. During the process of debt collection, individuals learn that they can be treated as if they have no right to respect or to redress.`,
};

HomeHero.propTypes = {};

export default withStyles(styles)(HomeHero);
