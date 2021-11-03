import React from "react";
import * as d3 from "d3";
import { formatMonthYear } from "../utils";

export default function TrendLine({ range, data }) {
  const height = 22;
  // map full range of data by month,
  // filling in months where data is unavailable
  const allMonths = d3.timeMonth.range(...range, 1).map((m) => {
    const month = data.find((d) => formatMonthYear(d.x) === formatMonthYear(m));
    if (month) return month;
    return {
      x: m,
      y: -1,
    };
  });
  // define y scale
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(allMonths, (d) => d.y)])
    .range([height, 2]);
  // define x scale
  const x = d3.scaleUtc().domain(range).range([0, 150]);
  // define the area renderer
  var area = d3
    .area()
    .defined((d) => d.y > -1)
    .x((d) => x(d.x))
    .y0(height)
    .y1((d) => (isNaN(d.y) ? height : y(d.y)));
  // define line renderer
  const line = d3
    .line()
    .defined((d) => d.y > -1)
    .curve(d3.curveCardinal)
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  // define unavailable data line renderer
  const lineUnavailable = d3
    .line()
    .defined(
      (d, i, all) =>
        d.y === -1 || (d.y !== -1 && all.length > i + 1 && all[i + 1].y === -1)
    )
    .curve(d3.curveCardinal)
    .x((d) => x(d.x))
    .y((d) => height - 2);
  return (
    <svg width="150" height={height + 2}>
      <path
        d={area(allMonths.filter(area.defined()))}
        fill="#EEEEE7"
        stroke="none"
      />
      <path
        d={line(allMonths.filter(line.defined()))}
        fill="none"
        strokeWidth={2}
        stroke="#797267"
      />
      <path
        d={lineUnavailable(allMonths)}
        fill="none"
        strokeWidth={2}
        stroke="#ccc"
        strokeDasharray="4 2"
      />
    </svg>
  );
}
