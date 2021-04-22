import React from "react";
import createLineChart from "./lib/line-chart";
import Chart from "./chart";

const LineChart = (props) => {
  const labels =
    props.data &&
    props.data.reduce((result, current) => {
      if (result.indexOf(current.group) === -1) result.push(current.group);
      return result;
    }, []);
  return <Chart chart={createLineChart} labels={labels} {...props} />;
};

export default LineChart;
