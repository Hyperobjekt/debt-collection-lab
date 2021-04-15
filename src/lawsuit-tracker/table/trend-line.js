import React from "react";
import * as d3 from "d3";

const genData = () => {
  const data = [];
  for (let i = 0, v = 2; i < 50; ++i) {
    v += Math.random() - 0.5;
    v = Math.max(Math.min(v, 4), 0);
    data.push({ step: i, value: v });
  }
  return data;
};
const walkY = d3.scaleLinear().domain([0, 4]).range([28, 2]);

const walkX = d3.scaleLinear().domain([0, 49]).range([0, 150]);

export default function TrendLine() {
  const line = d3
    .line()
    .x((d) => walkX(d.step))
    .y((d) => walkY(d.value));
  return (
    <svg width="150" height="30">
      <path d={line(genData())} fill="none" strokeWidth={2} stroke="#000" />
    </svg>
  );
}
