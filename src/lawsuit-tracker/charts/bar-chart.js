import React from "react";
import createBarChart from "./lib/bar-chart";

import Chart from "./chart";

const BarChart = (props) => {
  return <Chart chart={createBarChart} {...props} />;
};

export default BarChart;
