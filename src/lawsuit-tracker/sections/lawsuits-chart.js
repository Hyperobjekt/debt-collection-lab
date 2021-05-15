import React from "react";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import GroupedBarChart from "../charts/grouped-bar-chart";
import { formatInt, formatPercent } from "../utils";
import Mustache from "mustache";
import { Block } from "@hyperobjekt/material-ui-website/lib/block";

const SectionBlock = withStyles((theme) => ({
  root: {
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

const LawsuitsChart = ({ data }) => {
  return (
    <>
      <GroupedBarChart
        data={data}
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
          colors: ["#C0D6D9", "#979290", "#C5BFAB", "#D7AC5A"],
        }}
        options={{
          barSpacing: 1,
          groupPadding: 0.25,
          margin: [8, 2, 40, 48],
        }}
      />
    </>
  );
};

const LawsuitsChartSection = ({ content, data, children, ...props }) => {
  if (!data || !data.chartData) {
    return (
      <Block>
        <Typography variant="sectionTitle" component="h3">
          {content.TITLE}
        </Typography>
        <Typography variant="body1">
          Lawsuit history unavailable for this location.
        </Typography>
      </Block>
    );
  }
  const context = {
    topMonthName: data.topMonthName,
    topMonthPercent: formatPercent(data.topMonthPercent),
    topMonthCount: formatInt(data.topMonthCount),
    diffLabel: data.diffLabel,
    diffPercent: formatPercent(data.diffPercent),
    prePandemicCount: data.prePandemicCount,
  };
  const leftContent = (
    <>
      <Typography variant="sectionTitle" component="h3">
        {content.TITLE}
      </Typography>
      <Typography paragraph>
        {Mustache.render(content.DESCRIPTION, context)}{" "}
        {context.prePandemicCount > 12 &&
          Mustache.render(content.PANDEMIC_COMPARISON, context)}
      </Typography>
      {content.FOOTNOTE && (
        <Typography variant="caption" color="grey">
          {Mustache.render(content.FOOTNOTE, context)}
        </Typography>
      )}
      {children}
    </>
  );

  return (
    <SectionBlock
      left={leftContent}
      right={<LawsuitsChart data={data.chartData} />}
      {...props}
    />
  );
};

export default LawsuitsChartSection;
