import React from "react";
import Typography from "../../components/typography";
import { Grid, withStyles } from "@material-ui/core";
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
      <Typography variant="caption">
        Lawsuit filings since March 2020:
      </Typography>
      <img src="https://via.placeholder.com/280x48" />
      {children}
    </>
  );
  const rightContent = (
    <Grid container spacing={3} style={{ background: "#ccc", height: 400 }}>
      <Grid item md={6}>
        <Typography>Visual Goals</Typography>
        <ol>
          <li>identify neighborhoods where debt collection is concentrated</li>
          <li>
            highlight associated demographics within neighborhoods (racial
            majority, median household income)
          </li>
        </ol>
        <Typography>Unknowns</Typography>
        <ul>
          <li>
            <strong>time frame:</strong> should the map highlight pandemic time
            frame, entire timeframe of data set, or allow year selection?
          </li>
        </ul>
      </Grid>
      <Grid item md={6}>
        <Typography>Solution</Typography>
        <ul>
          <li>
            Choropleth map with shapes representing census tracts (or counties
            on state pages) that are shaded based on the number of lawsuits for
            the indicated time frame
          </li>
        </ul>
      </Grid>
      {/* <Grid item>Data: {JSON.stringify(data)}</Grid> */}
    </Grid>
  );
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default LawsuitsMapSection;
