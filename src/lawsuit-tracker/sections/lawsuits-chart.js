import React from "react";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import GroupedBarChart from "../charts/grouped-bar-chart";
import { formatPercent } from "../utils";

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
        On average, {data.topMonthName} is the month with the most debt
        collection lawsuits filed, accounting for{" "}
        {formatPercent(data.topMonthPercent)} of the filings for the year. Since
        the pandemic started, debt collection lawsuits have
        <code>INCREASED / DECREASED</code> by <code>PERCENT_DIFF</code> from the
        average of previous years.
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
