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
      {description && <Typography>{description}</Typography>}
      {children}
    </>
  );
  const rightContent = (
    <Grid container spacing={3} style={{ background: "#ccc", height: 400 }}>
      <Grid item md={6}>
        <Typography>Visual Goals</Typography>
        <ol>
          <li>identify if there is a "debt collection season" across years</li>
          <li>see what a pandemic year looks like compared to other years</li>
        </ol>
      </Grid>
      <Grid item md={6}>
        <Typography>Solutions</Typography>
        <ul>
          <li>
            <strong>Option 1:</strong>{" "}
            <a href="https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad">
              Grouped bar chart
            </a>
            , X axis from Jan - Dec, with a bar representing each year.
            Potentially add pattern fill to bars that fall within pandemic
            range.
          </li>
          <li>
            <strong>Option 2:</strong> Line chart, X axis from Jan - Dec, with
            line representing each year. Potentially add stroke pattern to line
            portions that fall within pandemic range.
          </li>
        </ul>
      </Grid>
      <Grid item>Data: {JSON.stringify(data)}</Grid>
    </Grid>
  );
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default LawsuitsChartSection;
