import Chart from "./chart";
import * as d3 from "d3";

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
      // adds the bars
      .addDonut({
        renderTooltip: (data) => {
          return (
            '<h1 class="tooltip__title">' +
            data.group +
            "</h1>" +
            '<div class="tooltip__item">' +
            "</div>"
          );
        },
      })
      .render()
  );
}

export default createFigure;
