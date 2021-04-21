import React from "react";
import Typography from "../../components/typography";
import { Grid, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";

const SectionBlock = withStyles((theme) => ({
  root: {},
}))(TwoColBlock);

const DemographicChartSection = ({
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
  const rightContent = (
    <Grid container spacing={3} style={{ background: "#ccc", height: 400 }}>
      <Grid item md={6}>
        <Typography>Visual Goals</Typography>
        <ol>
          <li>
            identify which neighborhoods, by racial majority, are most impacted
            by debt collection lawsuits over a given time period
          </li>
          <li>
            identify how the impact during the pandemic compares to the average
            of previous years (2018-2019 average)
          </li>
        </ol>
      </Grid>
      <Grid item md={6}>
        <Typography>Specification</Typography>
        <ul>
          <li>Grouped bar chart </li>
          <li>X axis representing months, from March 2020 - present</li>
          <li>
            Each month has up to 5 bars, each corresponding to the number of
            lawsuits filed by census tract racial majority (Asian, Black,
            Latinx, white, other)
          </li>
          <li>
            Has a button group that allows to toggle between raw count values
            and relative to average based 2018-2019 data.(
            <a href="https://evictionlab.org/eviction-tracking/bridgeport-ct/#eviction-filings-by-neighborhood-demographics">
              like eviction lab
            </a>
            )
          </li>
          <li>
            tooltip that reads out values for all racial groups for the
            corresponding hovered month
          </li>
        </ul>
      </Grid>
    </Grid>
  );
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default DemographicChartSection;
