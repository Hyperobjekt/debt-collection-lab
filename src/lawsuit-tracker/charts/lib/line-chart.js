import Chart from "./chart";
import * as d3 from "d3";

/**
 * Creates a comparator that brings values provided in `highlighted`
 * to the front of the array
 * @param {*} highlighted
 * @param {*} key
 * @returns {Array}
 */
function createHighlightComparator(highlighted, key) {
  key = key || "name";
  var hl =
    highlighted && highlighted.length ? highlighted.slice().reverse() : [];
  return function (a, b) {
    var aHighlightIndex = hl.indexOf(a[key]);
    var bHighlightIndex = hl.indexOf(b[key]);
    if (aHighlightIndex > -1 && bHighlightIndex > -1) {
      // both are highlighted, same item
      if (aHighlightIndex === bHighlightIndex) return 0;
      // both are highlighted, a is higher
      return aHighlightIndex > bHighlightIndex ? -1 : 1;
    }
    if (aHighlightIndex > -1) return 1;
    if (bHighlightIndex > -1) return -1;
    if (a[key] === b[key]) return 0;
    return a[key] > b[key] ? 1 : -1;
  };
}

/**
 * Gets X ticks based on type
 * @param {string} type [day, week, month, year]
 */
function getXTicks(type) {
  switch (type) {
    case "day":
      return d3.timeDay.every(1);
    case "week":
      return d3.timeWeek.every(1);
    case "month":
      return d3.timeMonth.every(1);
    case "year":
      return d3.timeYear.every(1);
    default:
      return d3.timeWeek.every(1);
  }
}

/**
 * Default formatter for X axis ( shows week range: "08/15 - 08/21" )
 * @param {*} d
 */
var xFormat = function (d) {
  var d1 = function (d) {
    return d3.timeFormat("%m/%e")(d).replace(" ", "");
  };
  return d1(d) + " - " + d1(d3.timeDay.offset(d, 6));
};

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
var lineSelector = function (data) {
  var grouped = d3
    .groups(data, function (d) {
      return d.group;
    })
    .map(function (d) {
      return d[1];
    });
  return grouped.map(function (group) {
    return group.map(function (d) {
      return [d.x, d.y, d.group];
    });
  });
};

/**
 * Creates the chart and renders
 * @param {HTMLElement} root
 * @param {Array<Object>} data
 * @param {Object} options { margin, x, y, groupBy, curve, highlight, xTicks, xFormat, yTicks, yFormat, title }
 */
function createFigure(root, data, options) {
  var highlighted = options.highlight ? options.highlight.reverse() : null;
  // sort data so highlighted items are at the end of the array in the same order as the "highlight" string
  if (highlighted) {
    var compare = createHighlightComparator(highlighted, "group");
    data.sort(compare);
    // add number to highlight class to root
    // $(root).addClass("chart__body--highlight" + highlighted.length);
  }
  options.xFormat = options.xFormat || xFormat;
  options.yFormat = options.yFormat || ((d) => d);
  var chart = new Chart(root, data, options);
  return (
    chart
      // adds y axis, using max of the trend line value or bar value
      .addAxisY({
        selector: ySelector,
        adjustExtent: function (extent) {
          var range = extent[1] - extent[0];
          return [extent[0] - range * 0.05, extent[1] + range * 0.05];
        },
        ticks: options.yTicks || 5,
        tickFormat: d3.format(options.yFormat || ",d"),
      })
      .addGridLines({
        ticks: options.yTicks || 5,
      })
      // adds time axis from dates in the dataset
      .addTimeAxis({
        selector: xSelector,
        ticks: options.xTicks ? getXTicks(options.xTicks) : undefined,
        tickFormat: options.xFormat
          ? d3.timeFormat(options.xFormat)
          : options.xTicks === "week"
          ? xFormat
          : undefined,
        adjustLabels: function (selection) {
          selection
            .selectAll(".tick text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-45)");
        },
      })
      .addMarklines()
      // adds the trend line
      .addLines({
        selector: lineSelector,
        curve: options.curve ? d3[options.curve] : null,
      })
      // adds a tooltip with the provided render function
      // .addTooltip(showTooltip, hideTooltip)
      // renders the chart
      .addHoverLine()
      .addHoverDot()
      .addVoronoi()
      .render()
  );
}

export default createFigure;
