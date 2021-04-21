import React from "react";
import Typography from "../../components/typography";
import { Grid, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";

const SectionBlock = withStyles((theme) => ({
  root: {},
}))(TwoColBlock);

const MapContent = ({ title, description }) => {
  return (
    <>
      <Typography variant="sectionTitle" component="h3">
        {title}
      </Typography>
      {description && <Typography>{description}</Typography>}
      <Typography variant="caption">
        Lawsuit filings since March 2020:
      </Typography>
      <img src="https://via.placeholder.com/280x48" />
    </>
  );
};

const MapVisual = () => {
  return (
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
      </Grid>
      <Grid item md={6}>
        <Typography>Specification</Typography>
        <ul>
          <li>
            Choropleth map with shapes representing census tracts (or counties
            on state pages)
          </li>
          <li>
            shapes are colored corresponding to the number of lawsuits since
            March 2020
          </li>
          <li>
            hovering a county or tract shows a tooltip with the county / tract
            name.
          </li>
          <li>
            hovering a tract shows the racial breakdown as well as median
            household income below the tract name
          </li>
          <li>
            has a gradient legend on the left that shows the values that
            correspond to the colors used on the map
          </li>
        </ul>
      </Grid>
      {/* <Grid item>Data: {JSON.stringify(data)}</Grid> */}
    </Grid>
  );
};

const LawsuitsMapSection = ({ title, description, data, ...props }) => {
  return (
    <SectionBlock
      left={<MapContent {...{ title, description }} />}
      right={<MapVisual />}
      {...props}
    />
  );
};

export default LawsuitsMapSection;
