import React, { useState } from "react";
import Typography from "../../components/typography";
import { Box, Button, ButtonGroup, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import LineChart from "../charts/line-chart";
import { formatInt, formatPercent } from "../utils";
import Mustache from "mustache";

const SectionBlock = withStyles((theme) => ({
  root: {
    background: theme.palette.background.alt,
    "& .legend": {
      justifyContent: "flex-start",
      paddingLeft: theme.spacing(6),
      flexWrap: "wrap",
    },
    "& .legend .legend__item": {
      flex: 0,
      marginRight: theme.spacing(3),
      marginBottom: theme.spacing(1),
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

const getChartTitle = (metric, content) => {
  switch (metric) {
    case "lawsuits":
      return content["COUNT_CHART_TITLE"];
    case "proportionalCountDiff":
      return content["PROPORTION_CHART_TITLE"];
    default:
      return "";
  }
};

const getOptionOverrides = (metric, content) => {
  switch (metric) {
    case "lawsuits":
      return {
        valueTemplate: content["COUNT_CHART_TOOLTIP"],
        xTooltipFormat: "%B %Y",
      };
    case "proportionalCountDiff":
      return {
        valueTemplate: content["PROPORTION_CHART_TOOLTIP"],
        xTooltipFormat: "%B %Y",
      };
    default:
      return {};
  }
};

const shapeChartData = (data, metric) => {
  return data.map((d) => ({ ...d, y: d.data[metric] }));
};

const DemographicChart = ({ data, content }) => {
  const [metric, setMetric] = useState("proportionalCountDiff");
  const chartData = shapeChartData(data, metric, content);
  const chartOptions = getOptionOverrides(metric, content);
  return (
    <>
      <Box display="flex" justifyContent="space-between" mt={2} mb={1}>
        <Box ml={5}>
          <Typography variant="h6" component="h4">
            {getChartTitle(metric, content)}
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
            Other: "#444",
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
  content,
  data: { chartData, tractCountByMajority, totalLawsuits },
  children,
  ...props
}) => {
  const context = {
    totalLawsuits,
  };
  const leftContent = (
    <>
      <Typography variant="sectionTitle" component="h3">
        {content.TITLE}
      </Typography>
      {content.DESCRIPTION && (
        <Typography paragraph>
          {Mustache.render(content.DESCRIPTION, context)}
        </Typography>
      )}
      <Typography component="h4" variant="h5">
        {content.BREAKDOWN_TITLE}
      </Typography>
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
                {Mustache.render(content["BREAKDOWN_LABEL"], {
                  group,
                  groupPercent: formatPercent(tractPercent),
                  lawsuitPercent: formatPercent(lawsuitPercent),
                  groupCount: formatInt(tractCount),
                  lawsuitCount: formatInt(lawsuitCount),
                })}
              </Typography>
            </li>
          )
        )}
      </ul>
      {children}
      {content.FOOTNOTE && (
        <Typography variant="caption" color="grey">
          {content.FOOTNOTE}
        </Typography>
      )}
    </>
  );
  return (
    <SectionBlock
      left={leftContent}
      right={<DemographicChart data={chartData} content={content} />}
      {...props}
    />
  );
};

export default DemographicChartSection;
