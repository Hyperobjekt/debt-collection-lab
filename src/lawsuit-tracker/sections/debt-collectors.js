import React, { useEffect } from "react";
import Typography from "../../components/typography";
import { Button, makeStyles, withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import { formatInt, formatPercent } from "../utils";
import DonutChart from "../charts/donut-chart";
import Mustache from "mustache";
import { slugify } from "../../utils";

const SectionBlock = withStyles((theme) => ({
  root: {
    background: theme.palette.background.alt,
  },
}))(TwoColBlock);

const useStyles = makeStyles((theme) => ({
  root: {},
  getDataIcon: {
    marginLeft: theme.spacing(0.5),
    width: 15,
  },
}));

const useChartStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    "& .chart__body": {
      flex: 0,
    },
    "& .chart__legend": {
      flex: 0,
      minWidth: 280,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      // overflowY: "scroll",
      // overflowX: "hidden",
      // maxHeight: 320,
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
      marginTop: 2,
      borderRadius: "100%",
    },
  },
}));

const TopCollectorsChart = ({ data }) => {
  const labelFormatter = (label, chart) => {
    const value = data.find((d) => d.group === label);
    return (
      <>
        <Typography component="span" weight="bold" variant="legendLabel">
          {label}
        </Typography>
        <br />
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
          colors: [
            "#6A9A83",
            "#BC5421",
            "#BFDCE0",
            "#DEAC4E",
            "#888494",
            "#6897c7",
            "#df9376",
            "#aba94a",
            "#bb8aa5",
            "#94671a",
            "#C7C0A9",
          ],
        }}
        labelFormatter={labelFormatter}
        options={{
          margin: [0, 32, 0, 0],
        }}
      />
    </>
  );
};

const DebtCollectorsSection = ({ content, data, children, ...props }) => {
  const classes = useStyles();
  const context = {
    name: data.name,
    collectorTotal: formatInt(data.collector_total),
    topCollectorPercent: formatPercent(10 / data.collector_total),
    topCount: formatInt(data.topLawsuits),
    topPercent: formatPercent(data.topPercent),
    totalCount: formatInt(data.total),
  };
  const leftContent = (
    <>
      <Typography variant="sectionTitle" component="h3">
        {content.TITLE}
      </Typography>
      <Typography paragraph>
        {Mustache.render(content.DESCRIPTION, context)}
      </Typography>
      <Button
        href={`/data/${slugify(context.name)}.csv`}
        download
        target="_blank"
      >
        Get the data
        <img className={classes.getDataIcon} src="/images/open-new.svg" />
      </Button>
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
