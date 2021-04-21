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
            identify which racial groups are most impacted by debt collection
            lawsuits over a given time period
          </li>
          <li>
            identify how the impact in the given time period compares to a
            historical average (e.g. 2021 vs (2018-2019 average)
          </li>
        </ol>
        <Typography>Unknowns</Typography>
        <ul>
          <li>
            <strong>Time frame:</strong> since beginning of pandemic, current
            calendary year, or other?
          </li>
        </ul>
      </Grid>
      <Grid item md={6}>
        <Typography>Solution</Typography>
        <ul>
          <li>
            Grouped bar chart (
            <a href="https://evictionlab.org/eviction-tracking/bridgeport-ct/#eviction-filings-by-neighborhood-demographics">
              like eviction lab
            </a>
            ), X axis representing pre-determined time period (e.g. March 2020 -
            present). User has option to toggle between count values and
            comparison to average (2018-2019).
          </li>
        </ul>
      </Grid>
    </Grid>
  );
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default DemographicChartSection;
