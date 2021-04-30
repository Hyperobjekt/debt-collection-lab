import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

  /** CHART LINES */
  .chart__line {
    fill: none;
    stroke-width: 2;
    stroke-dasharray: 0;
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
  colors: ["#000", "#444", "#777", "#aaa", "#ddd"],
  tooltip: {
    background: `rgba(0, 0, 0, 0.87)`,
    color: "#fff",
  },
};

const defaultFormatter = (d) => d;

const Chart = ({
  data,
  width = "100%",
  height = 420,
  options,
  chart,
  labelFormatter = defaultFormatter,
  theme = {},
  className,
  ...props
}) => {
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const [legendLabels, setLegendLabels] = useState([]);
  const mergedTheme = useMemo(
    () => ({
      ...defaultTheme,
      ...theme,
    }),
    [theme]
  );
  const mergedOptions = useMemo(
    () => ({
      ...options,
      colors: mergedTheme.colors,
    }),
    [options, mergedTheme]
  );
  const updateLabels = useCallback(
    (chart) => {
      if (!chart.colorScale) return;
      const labels = chart.colorScale
        .domain()
        .map((d) => [labelFormatter(d, chart), chart.colorScale(d)]);
      // TODO: do a more accurate check if labels have changed
      if (labels.length !== legendLabels.length) setLegendLabels(labels);
    },
    [legendLabels, setLegendLabels, labelFormatter]
  );

  useDidUpdate(() => {
    if (chartRef.current) {
      console.log("did update");
      chartRef.current.update({ data, options: mergedOptions });
      updateLabels(chartRef.current);
    }
  }, [data, mergedOptions, updateLabels]);

  useEffect(() => {
    if (elRef.current) {
      chartRef.current = chart(elRef.current, data, mergedOptions);
      updateLabels(chartRef.current);
    }
  }, []);

  return (
    <>
      <Global theme={mergedTheme} />
      <ChartContainer
        className={clsx("chart", className)}
        theme={mergedTheme}
        {...props}
      >
        <div style={{ width, height }} className="chart__body" ref={elRef} />
        {legendLabels.length && (
          <ChartLegend className="chart__legend" labels={legendLabels} />
        )}
      </ChartContainer>
    </>
  );
};

Chart.propTypes = {};

export default Chart;
