import React from "react";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import GroupedBarChart from "../charts/grouped-bar-chart";
import { formatPercent } from "../utils";
import Mustache from "mustache";

const SectionBlock = withStyles((theme) => ({
  root: {
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
  const context = {
    topMonthName: data.topMonthName,
    topMonthPercent: formatPercent(data.topMonthPercent),
    // TODO: Calculate these values!
    diffLabel: "increased",
    diffPercent: "0%",
  };
  const leftContent = (
    <>
      <Typography variant="sectionTitle" component="h3">
        {content.TITLE}
      </Typography>
      <Typography paragraph>
        {Mustache.render(content.DESCRIPTION, context)}
      </Typography>
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
