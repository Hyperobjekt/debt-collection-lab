import React from "react";
import Typography from "../../../components/typography";
// TODO: pull this in through graphql
import * as lang from "../../../../content/lawsuit-tracker/index.json";
import { Box, withStyles } from "@material-ui/core";
import TwoColBlock from "../../../components/sections/two-col-block";
import { Button } from "gatsby-material-ui-components";

const AboutBlock = withStyles((theme) => ({
  root: {
    background: theme.palette.background.alt,
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
    <Box>
      <Typography className="description">{lang.about.DESCRIPTION}</Typography>
      <Box display="flex" mt={3}>
        <Button to="/">Read our Methodology Report</Button>
      </Box>
    </Box>
  );
  return <AboutBlock left={leftContent} right={rightContent} />;
};

export default IndexAbout;
