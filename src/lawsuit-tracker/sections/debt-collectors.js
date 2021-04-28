import React, { useCallback } from "react";
import Typography from "../../components/typography";
import { Grid, makeStyles, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import * as d3 from "d3";
import { formatInt, formatPercent } from "../utils";
import DonutChart from "../charts/donut-chart";

const SectionBlock = withStyles((theme) => ({
  root: {},
}))(TwoColBlock);

const useChartStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    "& .chart__body": {
      flex: 0,
    },
    "& .chart__legend": {
      flex: 0,
      minWidth: 280,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    "& .legend .legend__item": {
      alignItems: "flex-start",
      flexGrow: 0,
      marginBottom: theme.spacing(1),
    },
    "& .legend .legend__label": {
      fontSize: theme.typography.pxToRem(14),
    },
    "& .legend .legend__color": {
      marginTop: 3,
    },
  },
}));

const TopCollectorsChart = ({ data }) => {
  const labelFormatter = (label, chart) => {
    const value = data.find((d) => d.group === label);
    return (
      <>
        <Typography weight="bold" variant="legendLabel">
          {label}
        </Typography>
        {formatInt(value.lawsuits)} lawsuits ({formatPercent(value.value)})
      </>
    );
  };
  const classes = useChartStyles();
  return (
    <>
      <DonutChart
        className={classes.root}
        data={data}
        width={320}
        height={320}
        theme={{
          background: "transparent",
          frame: { stroke: "none" },
          colors: ["#000", "#444", "#777", "#aaa", "#ddd", "#f0f0f0"],
        }}
        labelFormatter={labelFormatter}
        options={{
          margin: [0, 32, 0, 0],
        }}
      />
    </>
  );
};

const DebtCollectorsSection = ({
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
        Out of {formatInt(data.collector_total)} debt collectors in {data.name},
        the top 5 ({formatPercent(5 / data.collector_total)}) are responsible
        for {formatInt(data.topLawsuits)} ({formatPercent(data.topPercent)}) of{" "}
        {formatInt(data.total)} lawsuits.
      </Typography>
      {children}
    </>
  );

  return (
    <SectionBlock
      left={leftContent}
      right={<TopCollectorsChart data={data.chartData} />}
      {...props}
    />
  );
};

export default DebtCollectorsSection;
