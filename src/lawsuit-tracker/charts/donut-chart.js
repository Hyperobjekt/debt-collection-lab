import React from "react";
import createDonutChart from "./lib/donut-chart";
import Chart from "./chart";

const DonutChart = (props) => {
  return <Chart chart={createDonutChart} {...props} />;
};

export default DonutChart;
