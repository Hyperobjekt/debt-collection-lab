import React from "react";
import { default as Box } from "../../../components/layout/responsive-box";
import { Block } from "../../../components/sections";
import Typography from "../../../components/typography";
// TODO: pull this in through graphql
import * as lang from "../../../../content/lawsuit-tracker/index.json";

const IndexAbout = () => {
  return (
    <Block ContainerProps={{ md: { flexDirection: "row" } }}>
      <Box maxWidth={320} mr={5}>
        <Typography weight="bold" variant="h4" component="h2">
          {lang.about.TITLE}
        </Typography>
      </Box>
      <Box maxWidth={480}>
        <Typography>{lang.about.DESCRIPTION}</Typography>
      </Box>
    </Block>
  );
};

export default IndexAbout;
