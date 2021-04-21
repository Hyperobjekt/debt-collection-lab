import React from "react";
import Typography from "../../../components/typography";
// TODO: pull this in through graphql
import * as lang from "../../../../content/lawsuit-tracker/index.json";
import { withStyles } from "@material-ui/core";
import TwoColBlock from "../../../components/sections/two-col-block";

const AboutBlock = withStyles((theme) => ({
  root: {
    "& .description": {
      maxWidth: 480,
    },
  },
}))(TwoColBlock);

const IndexAbout = () => {
  const leftContent = (
    <Typography variant="sectionTitle" component="h2">
      {lang.about.TITLE}
    </Typography>
  );
  const rightContent = (
    <Typography className="description">{lang.about.DESCRIPTION}</Typography>
  );
  return <AboutBlock left={leftContent} right={rightContent} />;
};

export default IndexAbout;
