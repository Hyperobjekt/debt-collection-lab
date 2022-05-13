import React from "react";
import Typography from "../../components/typography";
import {
  Box,
  Button,
  List,
  ListItem,
  makeStyles,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import { formatInt, formatPercent } from "../utils";
import DonutChart from "../charts/donut-chart";
import Mustache from "mustache";
import { getCsvFileName } from "../../utils";

const colors = [
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
];

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
    // flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    "& .chart__body": {
      flex: 0,
    },
    "& .chart__legend": {
      display: "none", // using our own to style the Top 10
    },
  },
  legend: {
    [theme.breakpoints.up("sm")]: {
      columnCount: 2,
      columnGap: theme.spacing(2),
      "& $legendItem": {
        breakInside: "avoid",
      },
    },
  },
  itemDetails: {},
  legendItem: {
    // width: "auto",
    padding: 0,
    marginBottom: theme.spacing(1),
    "& svg": {
      width: 16,
      flex: "16px 0 0",
      marginRight: theme.spacing(1),
    },
    "& .MuiTypography-root": {
      lineHeight: 1,
    },
  },
}));

const Legend = ({ data }) => {
  const classes = useChartStyles();
  return (
    <List className={classes.legend}>
      {data.map(({ group, value, lawsuits }, i) => (
        <ListItem
          className={classes.legendItem}
          disableGutters={true}
          key={group}
        >
          <svg
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
            fill={colors[i]}
          >
            <circle cx="5" cy="5" r="5" />
          </svg>
          <Box className={classes.itemDetails}>
            <Typography component="span" weight="bold" variant="legendLabel">
              {group}
            </Typography>
            <br />
            {formatInt(lawsuits)} lawsuits ({formatPercent(value)})
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

const TopCollectorsChart = ({ data }) => {
  const classes = useChartStyles();
  const theme = useTheme();
  const isSmaller = useMediaQuery(theme.breakpoints.down("sm"));
  // donut more prominent (centered) on smaller screens
  const size = isSmaller ? 300 : 210;
  return (
    <DonutChart
      key={size} // forces rerender when size changes
      className={classes.root}
      data={data}
      width={size}
      height={size}
      theme={{
        background: "transparent",
        frame: { stroke: "none" },
        colors,
      }}
      options={{
        margin: [0, 0, 0, 22],
        myWidth: size,
        myHeight: size,
      }}
    />
  );
};

const DebtCollectorsSection = ({
  content,
  data,
  stateName,
  children,
  ...props
}) => {
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
      {children}
      <TopCollectorsChart data={data.chartData} />
    </>
  );
  const rightContent = (
    <>
      <Legend data={data.chartData} />
      {/* UNCOMMENT BELOW TO EXPOSE DATA DOWNLOAD */}
      {/* <Button
        href={getCsvFileName(context.name, stateName)}
        download
        target="_blank"
      >
        Get the data
        <img className={classes.getDataIcon} src="/images/open-new.svg" />
      </Button> */}
    </>
  );

  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default DebtCollectorsSection;
