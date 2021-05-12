import React from "react";
import Typography from "../../../components/typography";
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

const IndexAbout = ({ content, ...props }) => {
  const leftContent = (
    <Typography variant="sectionTitle" component="h2">
      {content.TITLE}
    </Typography>
  );
  const rightContent = (
    <Box>
      <Typography className="description">{content.DESCRIPTION}</Typography>
      {content.LINKS && (
        <Box display="flex" mt={3}>
          {content.LINKS.map(({ name, link }) => (
            <Button key={name} to={link}>
              {name}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
  return <AboutBlock left={leftContent} right={rightContent} />;
};

export default IndexAbout;
