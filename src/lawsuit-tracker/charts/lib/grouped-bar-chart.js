import Chart from "./chart";
import * as d3 from "d3";
import { formatInt } from "../../utils";

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
 * Creates the chart and renders
 * @param {HTMLElement} root
 * @param {Array<Object>} data
 * @param {Object} dataOptions { margin, x, y, groupBy, curve, highlight, xTicks, xFormat, yTicks, yFormat, title }
 */
function createFigure(root, data, options) {
  var chart = new Chart(root, data, options);
  return (
    chart
      // adds y axis, using max of the trend line value or bar value
      .addAxisY({
        selector: ySelector,
        ticks: options.yTicks || 5,
        tickFormat: d3.format(options.yFormat || ",d"),
      })
      .addGridLines({
        ticks: options.yTicks || 5,
      })
      // Adds bar chart axes for categories in the dataset.
      // adds time axis from dates in the dataset
      .addBarGroupAxis({
        selector: xSelector,
        ticks: options.xTicks,
        adjustLabels: function (selection) {
          if (window.innerWidth < 540) {
            selection
              .selectAll(".tick text")
              .attr("text-anchor", "end")
              .attr("transform", "rotate(-30)");
          } else {
            selection
              .selectAll(".tick text")
              .attr("text-anchor", null)
              .attr("transform", null);
          }
        },
      })
      // adds the bars
      .addBarGroups({
        renderTooltip: (data) => {
          return `<h1 class="tooltip__title">${
            data.group
          }</h1><ul class="tooltip__item-list">
            ${data.values
              .map(
                (y) =>
                  `<li class="tooltip__item tooltip__item--bar"><strong>${
                    y.group
                  }:</strong> ${formatInt(y.y)}</li>`
              )
              .join("")}</ul>`;
        },
      })
      .render()
  );
}
//${data.values.map((y) => `<div class="tooltip__item">${y.group} | ${y.y}</div>`)}

export default createFigure;
