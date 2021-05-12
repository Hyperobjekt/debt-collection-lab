import Chart from "./chart";
import { formatInt, formatPercent } from "../../../lawsuit-tracker/utils"

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
            '<h1 class="tooltip__title tooltip__title--donut">' +
            data.data.group +
            "</h1>" +
            '<div class="tooltip__item tooltip__item--donut">' +
              formatInt(data.data.lawsuits) + ' lawsuits (' + formatPercent(data.data.value) + ')' +
            "</div>"
          );
        },
      })
      .render()
  );
}

export default createFigure;
