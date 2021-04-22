import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import useDidUpdate from "@rooks/use-did-update";
import styled, { createGlobalStyle } from "styled-components";
import ChartLegend from "./chart-legend";

const getThemeKey = (keys) => (props) => {
  if (typeof keys === "string") keys = [keys];
  for (let i = 0; i < keys.length; i++) {
    const path = keys[i].split(".");
    const value = path.reduce((val, currentKey) => {
      return val && val.hasOwnProperty(currentKey) ? val[currentKey] : null;
    }, props.theme);
    if (value) return value;
  }
  // no theme value found, return inherit
  return "inherit";
};

const Global = createGlobalStyle`
  /** TOOLTIP */
  .chart__tooltip {
    position: absolute;
    background: ${getThemeKey("tooltip.background")};
    color: ${getThemeKey("tooltip.color")};
    padding: 12px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    transform: translate(-50%, calc(-100% - 12px));
    z-index: 999;
  }
  .chart__tooltip.chart__tooltip--show {
    opacity: 1;
  }
  .chart__tooltip .tooltip__title {
    font-size: 14px;
    margin-bottom: 4px;
    margin-top: 0;
    white-space: nowrap;
  }
  .chart__tooltip .tooltip__item {
    font-size: 12px;
    white-space: nowrap;
  }
`;

const ChartContainer = styled.div`
  .chart {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
  }
  .chart__background {
    fill: ${getThemeKey(["background"])};
  }
  .chart__frame {
    fill: none;
    stroke: ${(props) => props.theme.frame.stroke};
    stroke-width: ${(props) => props.theme.frame.strokeWidth};
  }
  .chart__root {
    display: block;
  }

  /** AXIS */
  .chart__axis .domain {
    stroke: ${getThemeKey(["axis.stroke"])};
    stroke-width: ${getThemeKey(["axis.strokeWidth"])};
  }
  .chart__axis line {
    stroke: ${getThemeKey(["axis.ticks"])};
    stroke-width: ${getThemeKey(["axis.tickWidth"])};
  }
  .chart__axis text {
    fill: ${getThemeKey("axis.color")};
    font-size: ${getThemeKey("axis.fontSize")};
    font-family: ${getThemeKey("axis.fontFamily")};
    font-weight: ${getThemeKey("axis.fontWeight")};
  }

  /** X AXIS */
  .chart__axis--x .domain {
    stroke: ${getThemeKey(["axis.x.stroke", "axis.stroke"])};
    stroke-width: ${getThemeKey(["axis.x.strokeWidth", "axis.strokeWidth"])};
  }
  .chart__axis--x line {
    stroke: ${getThemeKey(["axis.x.ticks", "axis.ticks"])};
    stroke-width: ${getThemeKey(["axis.x.tickWidth", "axis.tickWidth"])};
  }
  .chart__axis--x text {
    fill: ${getThemeKey(["axis.x.color", "axis.color"])};
    font-size: ${getThemeKey(["axis.x.fontSize", "axis.fontSize"])};
    font-family: ${getThemeKey(["axis.x.fontFamily", "axis.fontFamily"])};
    font-weight: ${getThemeKey(["axis.x.fontWeight", "axis.fontWeight"])};
  }

  /** Y AXIS */
  .chart__axis--y .domain {
    stroke: ${getThemeKey(["axis.y.stroke", "axis.stroke"])};
    stroke-width: ${getThemeKey(["axis.y.strokeWidth", "axis.strokeWidth"])};
  }
  .chart__axis--y line {
    stroke: ${getThemeKey(["axis.y.ticks", "axis.ticks"])};
    stroke-width: ${getThemeKey(["axis.y.tickWidth", "axis.tickWidth"])};
  }
  .chart__axis--y text {
    fill: ${getThemeKey(["axis.y.color", "axis.color"])};
    font-size: ${getThemeKey(["axis.y.fontSize", "axis.fontSize"])};
    font-family: ${getThemeKey(["axis.y.fontFamily", "axis.fontFamily"])};
    font-weight: ${getThemeKey(["axis.y.fontWeight", "axis.fontWeight"])};
  }

  /** GRID LINES */
  .chart__grid-lines .domain {
    stroke: none;
  }
  .chart__grid-lines line {
    stroke: ${getThemeKey("gridLines.stroke")};
  }

  /** CHART BARS */
  .chart__bar--bar0 {
    fill: ${getThemeKey("colors.0")};
  }
  .chart__bar--bar1 {
    fill: ${getThemeKey("colors.1")};
  }
  .chart__bar--bar2 {
    fill: ${getThemeKey("colors.2")};
  }
  .chart__bar--bar3 {
    fill: ${getThemeKey("colors.3")};
  }
  .chart__bar--bar4 {
    fill: ${getThemeKey("colors.4")};
  }

  /** CHART LINES */
  .chart__line {
    fill: none;
    stroke-width: 2;
    stroke-dasharray: 0;
  }
  .chart__line--0 {
    stroke: ${getThemeKey("colors.0")};
  }
  .chart__line--1 {
    stroke: ${getThemeKey("colors.1")};
  }
  .chart__line--2 {
    stroke: ${getThemeKey("colors.2")};
  }
  .chart__line--3 {
    stroke: ${getThemeKey("colors.3")};
  }
  .chart__line--4 {
    stroke: ${getThemeKey("colors.4")};
  }
  .chart__line--hovered {
    stroke-width: 5;
  }
  .chart__voronoi path {
    fill: none;
    pointer-events: all;
  }
  .chart__hover-line {
    stroke-width: 1;
    stroke: rgba(0, 0, 0, 0.1);
  }
  .chart__hover-dot {
    fill: #999;
  }

  /** LEGEND */
  .legend__item {
    display: flex;
    align-items: center;
  }
  .legend__color {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  .legend__color--0 {
    background: ${getThemeKey("colors.0")};
  }
  .legend__color--1 {
    background: ${getThemeKey("colors.1")};
  }
  .legend__color--2 {
    background: ${getThemeKey("colors.2")};
  }
  .legend__color--3 {
    background: ${getThemeKey("colors.3")};
  }
  .legend__color--4 {
    background: ${getThemeKey("colors.4")};
  }
`;

const defaultTheme = {
  background: "#fcfcfc",
  frame: {
    stroke: "#eee",
    strokeWidth: 2,
  },
  axis: {
    color: "#666",
    fontSize: "12px",
    fontFamily: "sans-serif",
    fontWeight: 500,
    stroke: "#ccc",
    ticks: "#ccc",
    strokeWidth: 2,
  },
  gridLines: {
    stroke: "#eee",
    strokeWidth: 1,
  },
  colors: ["#000", "#444", "#777", "#aaa", "#ddd"].reverse(),
  tooltip: {
    background: `rgba(0, 0, 0, 0.87)`,
    color: "#fff",
  },
};

const Chart = ({
  data,
  width = "100%",
  height = 420,
  options,
  labels,
  chart,
  theme = {},
  ...props
}) => {
  const elRef = useRef(null);
  const chartRef = useRef(null);

  useDidUpdate(() => {
    if (chartRef.current) {
      chartRef.current.update({ data, options });
    }
  }, [data, options]);

  useEffect(() => {
    if (elRef.current) {
      chartRef.current = chart(elRef.current, data, options);
    }
  }, []);

  return (
    <>
      <Global theme={{ ...defaultTheme, ...theme }} />
      <ChartContainer theme={{ ...defaultTheme, ...theme }} {...props}>
        <div style={{ width, height }} className="chart" ref={elRef} />
        {labels && <ChartLegend labels={labels} />}
      </ChartContainer>
    </>
  );
};

Chart.propTypes = {};

export default Chart;
