import React from "react";
import Typography from "../../components/typography";
import { withStyles } from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import LineChart from "../charts/line-chart";

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

const DemographicChart = ({ data }) => {
  return (
    <>
      <LineChart
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
          colors: ["#DBA336", "#BC5421", "#BFDCE0", "#7D95AA", "#68A58B"],
        }}
        options={{
          barSpacing: 1,
          groupPadding: 0.25,
          xFormat: "%b '%y",
          margin: [8, 8, 64, 48],
        }}
      />
    </>
  );
};

const DemographicChartSection = ({
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
      {description && <Typography>{description}</Typography>}
      {children}
    </>
  );
  return (
    <SectionBlock
      left={leftContent}
      right={<DemographicChart data={data.chartData} />}
      {...props}
    />
  );
};

export default DemographicChartSection;
