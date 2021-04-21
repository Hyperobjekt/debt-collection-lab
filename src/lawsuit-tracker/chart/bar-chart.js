// import React from "react";
// import { BarStack } from "@visx/shape";
// import { SeriesPoint } from "@visx/shape/lib/types";
// import { Group } from "@visx/group";
// import { Grid } from "@visx/grid";
// import { AxisBottom } from "@visx/axis";
// import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
// import { timeParse, timeFormat } from "d3-time-format";
// import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
// import { LegendOrdinal } from "@visx/legend";
// import { localPoint } from "@visx/event";

// const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
// const tooltipStyles = defaultStyles;
// const parseDate = d3.timeParse("%m/%Y");
// const format = d3.timeFormat("%b %y");
// const formatDate = (date) => format(parseDate(date));

// let tooltipTimeout;
// const colors = ["#6c5efb", "#c998ff", "#a44afe"];

// const getDomainX = () => {};

// const getDomainY = (series) => {};

// export default function BarChart({
//   width,
//   height,
//   series,
//   events = false,
//   margin = defaultMargin,
// }) {
//   // scales
//   const xScale = scaleBand({
//     domain: getDomainX(series),
//     padding: 0.2,
//   });
//   const yScale = scaleLinear({
//     domain: getDomainY(series),
//     nice: true,
//   });
//   const colorScale = scaleOrdinal({
//     domain: Object.keys(series),
//     range: colors.slice(0, Object.keys(series).length),
//   });

//   const {
//     tooltipOpen,
//     tooltipLeft,
//     tooltipTop,
//     tooltipData,
//     hideTooltip,
//     showTooltip,
//   } = useTooltip();

//   const { containerRef, TooltipInPortal } = useTooltipInPortal({
//     // TooltipInPortal is rendered in a separate child of <body /> and positioned
//     // with page coordinates which should be updated on scroll. consider using
//     // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
//     scroll: true,
//   });

//   if (width < 10) return null;
//   // bounds
//   const xMax = width;
//   const yMax = height - margin.top - 100;

//   xScale.rangeRound([0, xMax]);
//   temperatureScale.range([yMax, 0]);

//   return width < 10 ? null : (
//     <div style={{ position: "relative" }}>
//       <svg ref={containerRef} width={width} height={height}>
//         <Grid
//           top={margin.top}
//           left={margin.left}
//           xScale={xScale}
//           yScale={temperatureScale}
//           width={xMax}
//           height={yMax}
//           stroke="black"
//           strokeOpacity={0.1}
//           xOffset={xScale.bandwidth() / 2}
//         />
//         <Group top={margin.top}></Group>
//         <AxisBottom
//           top={yMax + margin.top}
//           scale={xScale}
//           tickFormat={formatDate}
//           tickLabelProps={() => ({
//             fontSize: 11,
//             textAnchor: "middle",
//           })}
//         />
//       </svg>
//       <div
//         style={{
//           position: "absolute",
//           top: margin.top / 2 - 10,
//           width: "100%",
//           display: "flex",
//           justifyContent: "center",
//           fontSize: "14px",
//         }}
//       >
//         <LegendOrdinal
//           scale={colorScale}
//           direction="row"
//           labelMargin="0 15px 0 0"
//         />
//       </div>

//       {tooltipOpen && tooltipData && (
//         <TooltipInPortal
//           top={tooltipTop}
//           left={tooltipLeft}
//           style={tooltipStyles}
//         >
//           <div style={{ color: colorScale(tooltipData.key) }}>
//             <strong>{tooltipData.key}</strong>
//           </div>
//           <div>{tooltipData.bar.data[tooltipData.key]}℉</div>
//           <div>
//             <small>{formatDate(getDate(tooltipData.bar.data))}</small>
//           </div>
//         </TooltipInPortal>
//       )}
//     </div>
//   );
// }
