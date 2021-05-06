import React, { useState } from "react";
import Typography from "../../components/typography";
import { Box, Button, ButtonGroup, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import LineChart from "../charts/line-chart";
import { formatInt, formatPercent } from "../utils";

const SectionBlock = withStyles((theme) => ({
  root: {
    background: theme.palette.background.alt,
    "& .legend": {
      justifyContent: "flex-start",
    },
    "& .legend .legend__item": {
      flex: 0,
      marginLeft: theme.spacing(3),
      "&:first-child": {
        marginLeft: theme.spacing(6),
      },
    },
    "& .legend .legend__label": {
      lineHeight: 1,
      marginTop: 1,
    },
    "& .legend .legend__color": {
      borderRadius: "100%",
    },
  },
}))(TwoColBlock);

const getChartTitle = (metric) => {
  switch (metric) {
    case "lawsuits":
      return "Number of Lawsuits by Neighborhood Racial Majority";
    case "proportionalCountDiff":
      return "Difference from Expected Number of Lawsuits Based on Neighborhood Proportions";
    default:
      return "";
  }
};

const getOptionOverrides = (metric) => {
  switch (metric) {
    case "lawsuits":
      return {
        valueTemplate: "{{yValue}} lawsuits in {{xValue}}",
        xTooltipFormat: "%B %Y",
      };
    case "proportionalCountDiff":
      return {
        valueTemplate:
          "Difference of {{yValue}} lawsuits from the expected value based on neighborhood proportions in {{xValue}}",
        xTooltipFormat: "%B %Y",
      };
    default:
      return {};
  }
};

const shapeChartData = (data, metric) => {
  return data.map((d) => ({ ...d, y: d.data[metric] }));
};

const DemographicChart = ({ data }) => {
  const [metric, setMetric] = useState("proportionalCountDiff");
  const chartData = shapeChartData(data, metric);
  const chartOptions = getOptionOverrides(metric);
  console.log("chart update", chartData);
  return (
    <>
      <Box display="flex" justifyContent="space-between" mt={2} mb={1}>
        <Box ml={5}>
          <Typography variant="h6" component="h4">
            {getChartTitle(metric)}
          </Typography>
        </Box>
      </Box>
      <LineChart
        data={chartData}
        theme={{
          background: "transparent",
          frame: { stroke: "none" },
          axis: {
            stroke: "#E7E1D9",
            color: "#797267",
            fontSize: "14px",
            fontFamily: "maple-web, sans-serif",
            fontWeight: 400,
            strokeWidth: 2,
          },
          gridLines: {
            stroke: "#E7E1D9",
          },
          colors: ["#DBA336", "#BC5421", "#BFDCE0", "#7D95AA", "#68A58B"],
        }}
        options={{
          barSpacing: 1,
          groupPadding: 0.25,
          xFormat: "%b '%y",
          yFormat: ",d",
          margin: [8, 8, 64, 48],
          curve: "curveCardinal",
          colorMap: {
            Asian: "#DBA336",
            Black: "#BC5421",
            Latinx: "#BFDCE0",
            White: "#7D95AA",
            "No Majority": "#68A58B",
          },
          ...chartOptions,
        }}
      />
      <Box ml={5} mt={3}>
        <ButtonGroup color="primary" aria-label="chart type selection">
          <Button
            color="primary"
            variant={metric === "lawsuits" ? "contained" : "outlined"}
            onClick={() => setMetric("lawsuits")}
          >
            Lawsuit Counts
          </Button>
          <Button
            color="primary"
            variant={
              metric === "proportionalCountDiff" ? "contained" : "outlined"
            }
            onClick={() => setMetric("proportionalCountDiff")}
          >
            Relative to Neighborhood Proportions
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
};

const DemographicChartSection = ({
  title,
  description,
  data: { chartData, tractCountByMajority, totalLawsuits },
  children,
  ...props
}) => {
  const leftContent = (
    <>
      <Typography variant="sectionTitle" component="h3">
        {title}
      </Typography>
      {description && <Typography paragraph>{description}</Typography>}
      <Typography weight="bold">Neighborhoods by Racial Majority</Typography>
      <ul style={{ paddingLeft: 16 }}>
        {tractCountByMajority.map(
          ({
            group,
            tractCount,
            tractPercent,
            lawsuitCount,
            lawsuitPercent,
          }) => (
            <li key={group}>
              <Typography>
                {group}: {formatPercent(tractPercent)} of neighborhoods,{" "}
                {formatPercent(lawsuitPercent)} of lawsuits
              </Typography>
            </li>
          )
        )}
      </ul>
      {children}
    </>
  );
  return (
    <SectionBlock
      left={leftContent}
      right={<DemographicChart data={chartData} />}
      {...props}
    />
  );
};

export default DemographicChartSection;
