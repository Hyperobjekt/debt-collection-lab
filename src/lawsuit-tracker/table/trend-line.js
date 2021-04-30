import React from "react";
import * as d3 from "d3";

export default function TrendLine({ range, data }) {
  const height = 22;
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.y))
    .range([height, 2]);
  const x = d3.scaleUtc().domain(range).range([0, 150]);
  // define the area
  var area = d3
    .area()
    .x((d) => x(d.x))
    .y0(height)
    .y1((d) => y(d.y));
  const line = d3
    .line()
    .curve(d3.curveCardinal)
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  return (
    <svg width="150" height={height + 2}>
      <path d={area(data)} fill="#EEEEE7" stroke="none" />
      <path d={line(data)} fill="none" strokeWidth={2} stroke="#797267" />
    </svg>
  );
}
