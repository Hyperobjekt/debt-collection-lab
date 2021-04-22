import Chart from "./chart";
import * as d3 from "d3";

/**
 * Selector for X values from data point
 * @param {*} d
 */
var xSelector = function (d) {
  return d.x;
};

/**
 * Selector for Y values from data point
 * @param {*} d
 */
var ySelector = function (d) {
  return d.y;
};

/**
 * Selects the line data set from the chart data
 * @param {*} data
 */
var barSelector = function (data) {
  return data.map(function (d) {
    return [d.x, d.y, d.name];
  });
};

/**
 * Creates the chart and renders
 * @param {HTMLElement} root
 * @param {Array<Object>} data
 * @param {Object} options { margin, x, y, , yTicks, yFormat, title }
 */
function createFigure(root, data, options) {
  const yFormat = d3.format(options.yFormat || ",d");
  const yTooltipFormat = d3.format(
    options.yTooltipFormat || options.yFormat || ",d"
  );

  var chart = new Chart(root, data, options);
  return (
    chart
      // adds y axis, pads it if no extend is passed
      .addAxisY({
        selector: ySelector,
        adjustExtent: function (extent) {
          var range = extent[1] - extent[0];
          const paddedExtent = [
            extent[0] - range * 0.05,
            extent[1] + range * 0.05,
          ];
          if (options.yMin) paddedExtent[0] = parseFloat(options.yMin);
          if (options.yMax) paddedExtent[1] = parseFloat(options.yMax);
          return paddedExtent;
        },
        ticks: options.yTicks || 5,
        tickFormat: yFormat,
      })
      // adds band axis from the x data
      .addBarAxis({
        selector: xSelector,
        adjustLabels: function (selection) {
          selection
            .selectAll(".tick text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-66)")
            .attr("dx", "-1em")
            .attr("dy", "0em");
        },
      })
      // adds the bars
      .addBandedBars({
        selector: barSelector,
        renderTooltip: function (hoverData) {
          const tooltip = {
            title: hoverData[0],
            value: yTooltipFormat(hoverData[1]),
          };
          return (
            '<h1 class="tooltip__title">' +
            tooltip.title +
            "</h1>" +
            '<div class="tooltip__item">' +
            "<span> " +
            tooltip.value +
            "</span>" +
            "</div>"
          );
        },
      })
      .render()
  );
}

export default createFigure;
