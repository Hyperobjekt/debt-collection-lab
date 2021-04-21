import React from "react";
import Typography from "../../components/typography";
import { Grid, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";

const SectionBlock = withStyles((theme) => ({
  root: {},
}))(TwoColBlock);

const LawsuitsChartSection = ({
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
      {description && <Typography paragraph>{description}</Typography>}
      <Typography paragraph>
        On average, <code>MONTH_NAME</code> is the month with the most debt
        collection lawsuits filed, accounting for <code>PERCENT_TOTAL</code> of
        the filings for the year. Since the pandemic started, debt collection
        lawsuits have
        <code>INCREASED / DECREASED</code> by <code>PERCENT_DIFF</code> from the
        average of previous years.
      </Typography>
      {children}
    </>
  );
  const rightContent = (
    <Grid container spacing={3} style={{ background: "#ccc", height: 400 }}>
      <Grid item md={6}>
        <Typography>Visual Goals</Typography>
        <ol>
          <li>identify if there is a "debt collection season" across years</li>
          <li>
            identify what a pandemic year looks like compared to other years
          </li>
        </ol>
      </Grid>
      <Grid item md={6}>
        <Typography>Specification</Typography>
        <ul>
          <li>
            <a href="https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad">
              Grouped bar chart
            </a>
          </li>
          <li>X axis w/ 12 months (Jan - Dec)</li>
          <li>
            each month has 4 bars, representing years (2018, 2019, 2020, 2021)
          </li>
          <li>
            pattern fill on bars that fall within pandemic range (March 2020 -
            present)
          </li>
          <li>
            legend that shows each bar color and corresponding year, as well as
            pattern fill corresponding to pandemic timeframe{" "}
          </li>
          <li>
            tooltip that reads out values for all bars for the corresponding
            hovered month
          </li>
        </ul>
      </Grid>
      {/* <Grid item>Data: {JSON.stringify(data)}</Grid> */}
    </Grid>
  );
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default LawsuitsChartSection;
