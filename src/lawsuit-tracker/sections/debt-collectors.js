import React from "react";
import Typography from "../../components/typography";
import { Grid, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import * as d3 from "d3";
import { formatPercent } from "../utils";

const SectionBlock = withStyles((theme) => ({
  root: {},
}))(TwoColBlock);

const DebtCollectorsSection = ({
  title,
  description,
  data,
  total,
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
    <Grid container spacing={3}>
      <Grid item sm={6} style={{ background: "#ccc" }}>
        <Typography>Visual Goals</Typography>
        <ol>
          <li>Highlight debt collector proportion as part of a whole</li>
        </ol>
        <Typography>Solution</Typography>
        <ul>
          <li>
            <strong>Option 1:</strong>
            <a href="https://www.d3-graph-gallery.com/donut">Donut</a> (or pie)
            chart with top 5 collectors, and "other" category.
          </li>
        </ul>
      </Grid>
      <Grid item sm={6}>
        <Typography>
          The top 5 debt collectors are responsible for{" "}
          {formatPercent(data.percent)} of lawsuits.
        </Typography>
        <ol>
          {data.collectors.map((c) => (
            <li key={c.collector} style={{ marginBottom: 8 }}>
              <strong>{c.collector}:</strong> {c.lawsuits} (
              {formatPercent(c.lawsuits / data.total)})
            </li>
          ))}
        </ol>
      </Grid>
    </Grid>
  );
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default DebtCollectorsSection;
