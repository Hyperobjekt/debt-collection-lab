import React from "react";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";

const SectionBlock = withStyles((theme) => ({
  root: {},
}))(TwoColBlock);

const DebtCollectorsSection = ({
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
      {children}
    </>
  );
  const rightContent = <img src="https://via.placeholder.com/800x320" />;
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default DebtCollectorsSection;
