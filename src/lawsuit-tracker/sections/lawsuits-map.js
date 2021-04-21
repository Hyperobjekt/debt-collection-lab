import React from "react";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";

const SectionBlock = withStyles((theme) => ({
  root: {},
}))(TwoColBlock);

const LawsuitsMapSection = ({
  title,
  description,
  data,
  children,
  ...props
}) => {
  const leftContent = (
    <>
      <Typography variant="sectionTitle" component="h3">
        {title}
      </Typography>
      {description && <Typography>{description}</Typography>}
      <Typography variant="caption">Lawsuit filings:</Typography>
      <img src="https://via.placeholder.com/280x48" />
      {children}
    </>
  );
  const rightContent = <img src="https://via.placeholder.com/800x450" />;
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default LawsuitsMapSection;
