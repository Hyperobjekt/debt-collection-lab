import React from "react";
import Typography from "../../components/typography";
import { Box, makeStyles, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import ChoroplethMap from "../map/ChoroplethMap";
import * as d3 from "d3";
import { formatInt, formatMonthYear } from "../utils";
import Mustache from "mustache";

const SectionBlock = withStyles((theme) => ({
  root: {
    position: "relative",
    background: theme.palette.background.alt,
    minHeight: 420,
    [theme.breakpoints.up("md")]: {
      minHeight: 500,
    },
    [theme.breakpoints.up("lg")]: {
      minHeight: 600,
    },
  },
}))(TwoColBlock);

const useMapStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    minHeight: 420,
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      width: `calc(((100vw - 100%) / 2) + 63%)`,
      height: "100%",
      right: 1, // 1px to prevent horizontal overflow on page
      top: 0,
      bottom: 0,
    },
  },
}));

const LawsuitMap = ({ data, colorScale }) => {
  const classes = useMapStyles();
  return (
    <div className={classes.container}>
      <ChoroplethMap data={data} colorScale={colorScale} />
    </div>
  );
};

const MapContent = ({ data, content, colorScale }) => {
  const colors = colorScale.range().join(",");
  const values = colorScale.domain();
  const gradient = `linear-gradient(90deg, ${colors})`;
  return (
    <>
      <Typography variant="sectionTitle" component="h3">
        {content.TITLE}
      </Typography>
      {content.DESCRIPTION && (
        <Typography>{Mustache.render(content.DESCRIPTION, data)}</Typography>
      )}
      <Typography style={{ marginTop: 24, display: "block" }} variant="caption">
        {Mustache.render(content.LABEL, {
          startDate: formatMonthYear(data.startDate),
        })}
      </Typography>
      <Box style={{ width: 280 }} mb={4}>
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
      {content.FOOTNOTE && (
        <Typography variant="caption" color="grey">
          {Mustache.render(content.FOOTNOTE, data)}
        </Typography>
      )}
    </>
  );
};

const LawsuitsMapSection = ({ content, data, ...props }) => {
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(data.geojson.features, (d) => d.properties.value))
    .range(["#f5eFdB", "#BC5421"])
    .nice();
  return (
    <SectionBlock
      left={<MapContent {...{ data, content, colorScale }} />}
      right={<LawsuitMap data={data.geojson} colorScale={colorScale} />}
      {...props}
    />
  );
};

export default LawsuitsMapSection;
