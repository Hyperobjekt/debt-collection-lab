import React from "react";
import createGroupedBarChart from "./lib/grouped-bar-chart";
import Chart from "./chart";

const GroupedBarChart = (props) => {
  return <Chart chart={createGroupedBarChart} {...props} />;
};

export default GroupedBarChart;
