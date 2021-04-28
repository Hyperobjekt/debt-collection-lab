import React from "react";
import Typography from "../../components/typography";
import { Box, Grid, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import ChoroplethMap from "../map/ChoroplethMap";
import * as counties from "../../../data/09-counties.json";
import * as d3 from "d3";
import { formatInt } from "../utils";

const SectionBlock = withStyles((theme) => ({
  root: {},
}))(TwoColBlock);

const LawsuitMap = ({ data, colorScale }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
      }}
    >
      <ChoroplethMap data={data} colorScale={colorScale} />
    </div>
  );
};

const MapContent = ({ title, description, colorScale }) => {
  const colors = colorScale.range().join(",");
  const values = colorScale.domain();
  const gradient = `linear-gradient(90deg, ${colors})`;
  return (
    <>
      <Typography variant="sectionTitle" component="h3">
        {title}
      </Typography>
      {description && <Typography>{description}</Typography>}
      <Typography style={{ marginTop: 24, display: "block" }} variant="caption">
        Lawsuit filings since March 2020:
      </Typography>
      <Box style={{ width: 280 }}>
        <div style={{ background: gradient, width: 280, height: 16 }} />
        <Box
          display="flex"
          justifyContent="space-between"
          style={{
            borderTop: `1px solid #ccc`,
            marginTop: 2,
            height: 5,
            marginRight: 1,
            marginLeft: 1,
            boxShadow: `1px 0 0 #ccc, -1px 0 0 #ccc`,
          }}
        >
          <Typography
            style={{ transform: `translate(-50%, 4px)` }}
            variant="caption"
          >
            {formatInt(values[0])}
          </Typography>
          <Typography
            style={{ transform: `translate(50%, 4px)` }}
            variant="caption"
          >
            {formatInt(values[1])}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

const LawsuitsMapSection = ({ title, description, data, ...props }) => {
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(data.features, (d) => d.properties.value))
    .range(["#eee", "#999"]);

  return (
    <SectionBlock
      left={<MapContent {...{ title, description, colorScale }} />}
      right={<LawsuitMap data={data} colorScale={colorScale} />}
      {...props}
    />
  );
};

export default LawsuitsMapSection;
