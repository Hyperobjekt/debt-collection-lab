import React from "react";
import createGroupedBarChart from "./lib/grouped-bar-chart";
import Chart from "./chart";

const GroupedBarChart = (props) => {
  const labels =
    props.data &&
    props.data.reduce((result, current) => {
      if (result.indexOf(current.group) === -1) result.push(current.group);
      return result;
    }, []);
  return <Chart chart={createGroupedBarChart} labels={labels} {...props} />;
};

export default GroupedBarChart;
