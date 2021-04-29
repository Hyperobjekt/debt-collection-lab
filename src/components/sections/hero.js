import { withStyles } from "@material-ui/core";
import React from "react";
import { Block } from ".";

const HeroBlock = withStyles((theme) => ({
  root: {
    minHeight: `66vh`,
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch",
    background: theme.palette.background.dark,
    color: theme.palette.text.light,
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}))(Block);

const Hero = (props) => {
  return <HeroBlock {...props} />;
};

export default Hero;
