import * as d3 from "d3";
import { voronoi } from "d3-voronoi";
import Mustache from "mustache";

const DEFAULT_COLORS = ["#333", "#555", "#777", "#999"];

function getAxisFunction(position) {
  switch (position) {
    case "left":
      return d3.axisLeft;
    case "bottom":
    default:
      return d3.axisBottom;
  }
}

/** Makes a unique identifier */
function makeId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Parses a margin string into an array of pixel values
 * @param {*} marginString
 * @returns {Array<Integer>} [top, right, bottom, left]
 */
function getMargin(margin) {
  if (Array.isArray(margin) && margin.length === 4) return margin;
  if (!margin || typeof margin !== "string") return [8, 48, 60, 54];
  // parse margin string
  const parts = margin.split(" ").map(function (m) {
    return Math.round(Number(m));
  });
  if (parts.length === 4) return parts;
  if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
  if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
  if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
  console.warn("invalid margin provided for chart");
  return [8, 48, 60, 54];
}

/**
 * Creates an empty chart with root elements
 * @param {DOMElement} svgEl a SVG DOM element to render the chart in
 * @param {Array<Object>} data data to use for the chart
 * @param {Object} options
 */
function Chart(rootEl, data, options) {
  rootEl.querySelector("svg")?.remove(); // drop svg if one already exists
  var svgEl = d3.select(rootEl).append("svg").node();
  var rect = rootEl.getBoundingClientRect();
  var tooltipEl = document.createElement("div");
  tooltipEl.className = "chart__tooltip chart__tooltip--" + rootEl.id;
  document.body.appendChild(tooltipEl);
  this.uid = makeId(); // unique id for the chart
  this.data = data;
  options = options || {};
  options.margin = getMargin(options.margin);
  this.options = Object.assign(
    {
      // width: rect.width,
      // height: rect.height,
      // TODO: is there a simpler way? do we need a fallback? do we need the 210 fallback?
      width: Math.max(rect.width, options.myWidth || 210),
      height: Math.max(rect.height, options.myHeight || 210),
    },
    this.defaultOptions,
    options
  );
  this.innerWidth =
    this.options.width + this.options.margin[1] + this.options.margin[3];
  this.innerHeight =
    this.options.height + this.options.margin[0] + this.options.margin[2];
  this.svgEl = svgEl;
  this.updaters = {};
  this.selections = {};
  this.selections.tooltip = d3.select(tooltipEl);
  this.xScale = null;
  this.yScale = null;
  this.hovered = null;
  this.lineData = null;
  this.xBandScale = d3.scaleBand();
  this.addRoot();
  this.addBaseGroup();
  this.addBackground();
  this.addDataGroup();
  this.addOverlayGroup();
  this.addClipPath();
  this.addFrame();
  var _this = this;
  this.showTooltip = function (e, render) {
    if (!_this.hovered) return;
    var selection = _this.getSelection("tooltip");
    selection.classed("chart__tooltip--show", true);
    var topOffset = window.scrollY + e.clientY;
    var html = render(_this.hovered);
    var rect = selection.node().getBoundingClientRect();
    var xPos = Math.min(
      window.innerWidth - rect.width / 2 - 12,
      Math.max(12 + rect.width / 2, e.clientX)
    );
    selection
      .style("top", topOffset + "px")
      .style("left", xPos + "px")
      .html(html);
  };
  this.hideTooltip = function (e) {
    var selection = _this.getSelection("tooltip");
    selection.classed("chart__tooltip--show", false);
    // selection.style("top")
  };

  window.addEventListener("resize", function () {
    var rect = rootEl.getBoundingClientRect();
    _this.update({
      options: {
        ..._this.options,
        width: rect.width,
        height: rect.height,
      },
    });
  });
}

/** Default options for the chart */
Chart.prototype.defaultOptions = {
  xTicks: 4,
  xTicksFormat: d3.timeFormat("%b"),
  yTicksFormat: d3.format(",d"),
  colors: DEFAULT_COLORS,
};

/**
 * Returns the width of the data area for the chart
 */
Chart.prototype.getInnerWidth = function () {
  return this.options.width - this.options.margin[1] - this.options.margin[3];
};

/**
 * Returns the height of the data area for the chart
 */
Chart.prototype.getInnerHeight = function () {
  return this.options.height - this.options.margin[0] - this.options.margin[2];
};

/**
 * Sets the ID of the hovered data
 */
Chart.prototype.setHovered = function (id) {
  this.hovered = id;
};

/**
 * Gets a selection that has been added to the chart
 * @param {string} id
 */
Chart.prototype.getSelection = function (id) {
  return this.selections[id];
};
/**
 * Gets a renderer that has been added to the chart
 * @param {string} id
 */
Chart.prototype.getRenderer = function (id) {
  return this.updaters[id];
};
/**
 * Adds a selection to the chart
 * @param {string} id identifier for this selection
 * @param {string} parentId id of the parent selection
 * @param {function} createSelection function that returns the selection
 */
Chart.prototype.addSelection = function (id, parentId, createSelection) {
  if (id === "root") {
    this.selections["root"] = createSelection(null, this);
  } else {
    this.selections[id] = createSelection(this.selections[parentId], this);
  }
  return this;
};

/**
 * Adds a function that executes on render
 * @param {string} id identifier for the render function
 * @param {function} createRenderFunction a function that returns the render function
 */
Chart.prototype.addRenderFunction = function (id, createRenderFunction) {
  this.updaters[id] = createRenderFunction(this.getSelection(id), this);
  return this;
};

/**
 * Adds an element, with a selection and render function to the chart
 * @param {string} id
 * @param {string} parentId
 * @param {function} createSelection returns a selection
 * @param {function} createRenderFunction returns a render function
 */
Chart.prototype.addElement = function (
  id,
  parentId,
  createSelection,
  createRenderFunction
) {
  this.addSelection(id, parentId, createSelection).addRenderFunction(
    id,
    createRenderFunction
  );
  return this;
};

/**
 * Creates the chart root container
 */
Chart.prototype.addRoot = function () {
  function createRootSelection(parent, chart) {
    return d3.select(chart.svgEl).attr("class", "chart__root");
  }
  function createRootRenderer(selection, chart) {
    return function () {
      selection
        .attr("width", chart.options.width)
        .attr("height", chart.options.height);
    };
  }
  this.addElement("root", null, createRootSelection, createRootRenderer);
  return this;
};

/**
 * Adds a group for chart axis elements
 */
Chart.prototype.addBaseGroup = function () {
  // function that returns the selection
  function createBaseSelection(parent) {
    return parent.append("g").attr("class", "chart__base");
  }
  // function that updates the selection on re-renders
  function createRenderer(selection, chart) {
    return function () {
      selection.attr(
        "transform",
        "translate(" +
          chart.options.margin[3] +
          " " +
          chart.options.margin[0] +
          ")"
      );
    };
  }
  this.addElement("base", "root", createBaseSelection, createRenderer);
  return this;
};

/**
 * Adds a clipped group for chart data (bars, lines, etc)
 */
Chart.prototype.addDataGroup = function () {
  // function that returns the selection
  function createDataSelection(parent, chart) {
    return parent
      .append("g")
      .attr("class", "chart__data")
      .attr("clip-path", "url(#" + chart.uid + "_clip)");
  }
  // function that updates the selection on re-renders
  function createRenderer(selection, chart) {
    return function () {
      selection.attr(
        "transform",
        "translate(" +
          chart.options.margin[3] +
          " " +
          chart.options.margin[0] +
          ")"
      );
    };
  }
  this.addElement("data", "root", createDataSelection, createRenderer);
  return this;
};

/**
 * Adds a clipped group for chart data (bars, lines, etc)
 */
Chart.prototype.addOverlayGroup = function () {
  // function that returns the selection of the group element
  function createOverlaySelection(parent) {
    return parent.append("g").attr("class", "chart__overlay");
  }
  // function that updates the selection on re-renders
  function createRenderer(selection, chart) {
    return function () {
      selection.attr(
        "transform",
        "translate(" +
          chart.options.margin[3] +
          " " +
          chart.options.margin[0] +
          ")"
      );
    };
  }
  this.addElement("overlay", "root", createOverlaySelection, createRenderer);
  return this;
};

/**
 * Adds a background to the chart
 */
Chart.prototype.addBackground = function () {
  function createSelection(parentSelection) {
    return parentSelection.append("rect").attr("class", "chart__background");
  }
  function createRenderFunction(selection, chart) {
    return function () {
      selection
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", chart.getInnerWidth())
        .attr("height", chart.getInnerHeight());
    };
  }
  this.addElement("background", "base", createSelection, createRenderFunction);
  return this;
};

/**
 * Adds a frame border to the chart
 */
Chart.prototype.addFrame = function () {
  function createSelection(parentSelection) {
    return parentSelection.append("rect").attr("class", "chart__frame");
  }
  function createRenderFunction(selection, chart) {
    return function () {
      selection
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", chart.getInnerWidth())
        .attr("height", chart.getInnerHeight());
    };
  }
  this.addElement("frame", "overlay", createSelection, createRenderFunction);
  return this;
};

/**
 * Adds a clip path around the frame area for the chart
 */
Chart.prototype.addClipPath = function () {
  var _this = this;
  function createSelection(parentSelection) {
    return parentSelection
      .append("clipPath")
      .attr("id", _this.uid + "_clip")
      .append("rect");
  }
  function createRenderFunction(selection, chart) {
    return function () {
      selection
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", chart.getInnerWidth())
        .attr("height", chart.getInnerHeight());
    };
  }
  this.addElement("clipPath", "root", createSelection, createRenderFunction);
  return this;
};

/**
 * Adds a pattern fill area to the chart
 * @param {Array} areaData [start, end]
 */
Chart.prototype.addArea = function (areaData, options) {
  // if not start / end areaData then return
  if (!areaData[0] && !areaData[1]) return this;
  // set default options
  options = options || {};
  options.angle = options.angle || 45;
  options.areaId = options.areaId || "area";
  options.addPattern = options.addPattern === false ? false : true;
  // make sure IDs have not already been assigned
  if (
    options.patternId &&
    this.getSelection(options.patternId) &&
    options.addPattern
  )
    throw new Error("patternId already exists: " + options.patternId);
  if (this.getSelection(options.areaId))
    throw new Error("areaId already exists: " + options.areaId);
  // creates SVG pattern
  function createPattern(parentSelection) {
    return parentSelection
      .append("pattern")
      .attr("id", options.patternId)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", "rotate(" + options.angle + ")")
      .html(
        '<rect class="chart__pattern chart__pattern--' +
          options.patternId +
          '" x="0" y="0" width="6" height="12" />'
      );
  }
  // creates area element and returns selection
  function createAreaSelection(parentSelection) {
    return parentSelection
      .append("rect")
      .attr("class", "chart__area chart__area--" + options.areaId);
  }
  // renders the area rect in the chart
  function createAreaRenderFunction(selection, chart) {
    return function () {
      var maxDate = chart.xScale.domain()[1];
      areaData[1] =
        !areaData[1] || +areaData[1] > +maxDate ? maxDate : areaData[1];
      selection
        .attr("x", chart.xScale(areaData[0]))
        .attr("y", 1)
        .attr(
          "width",
          chart.xScale(areaData[1]) - chart.xScale(areaData[0]) - 1
        )
        .attr("height", chart.getInnerHeight() - 2)
        .attr("fill", "url(#" + options.patternId + ")");
    };
  }
  // add selections and render function to chart
  options.patternId &&
    options.addPattern &&
    this.addSelection(options.patternId, "root", createPattern);
  this.addSelection(options.areaId, "data", createAreaSelection);
  this.addRenderFunction(options.areaId, createAreaRenderFunction);
  return this;
};

/**
 * Adds tooltip functionality to the chart
 * @param {function} showTooltip function that shows the tooltip
 * @param {function} hideTooltip function that hides the tooltip
 */
Chart.prototype.addTooltip = function (showTooltip, hideTooltip) {
  var _this = this;
  this.selections["hover-line"] = this.selections["data"]
    .append("line")
    .attr("class", "chart__hover-line");
  this.selections["hover"] = this.selections["data"]
    .append("rect")
    .attr("class", "chart__hover")
    .attr("x", 0)
    .attr("y", 0)
    .on("mousemove", handleHover)
    .on("mouseout", handleHoverOut);
  this.updaters["hover"] = function () {
    _this.selections["hover"]
      .attr("width", _this.getInnerWidth())
      .attr("height", _this.getInnerHeight())
      .attr("opacity", 0);
  };

  function handleHover() {
    var xHovered = _this.xScale.invert(
      d3.pointer(_this.selections["hover"].node())[0]
    );
    showTooltip(_this, xHovered);
  }

  function handleHoverOut() {
    hideTooltip(_this);
  }

  return this;
};

/**
 * Adds a rect in the data area that sets the hovered data
 */
Chart.prototype.addHoverRect = function (overrides) {
  var options = overrides || {};
  function getClosestIndex(vals, val) {
    var index = d3.bisect(vals, val);
    var left = vals[index - 1];
    var right = vals[index];
    var leftDiff = Math.abs(+left - +val);
    var rightDiff = Math.abs(+right - +val);
    return leftDiff < rightDiff ? index - 1 : index;
  }
  function createSelection(parentSelection) {
    return parentSelection.append("rect").attr("class", "chart__hover-rect");
  }
  function createRenderer(selection, chart) {
    return function () {
      selection
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", chart.getInnerWidth())
        .attr("height", chart.getInnerHeight())
        .attr("fill", "transparent")
        .on("mousemove", (event) => {
          var xPos = event.offsetX - chart.options.margin[3];
          var xVal = chart.xScale.invert(xPos);
          var xVals = chart.data.map(function (d) {
            return d.x;
          });
          var closestIndex = getClosestIndex(xVals, xVal);
          chart.setHovered(chart.data[closestIndex]);
          var renderLine = chart.getRenderer("hoverLine");
          renderLine && renderLine();
          options.renderTooltip &&
            chart.showTooltip(event, options.renderTooltip);
        })
        .on("mouseout", (event, d) => {
          chart.setHovered(null);
          options.renderTooltip && chart.hideTooltip();
          var renderLine = chart.getRenderer("hoverLine");
          renderLine && renderLine();
        });
    };
  }
  this.addElement("hoverRect", "data", createSelection, createRenderer);
  return this;
};

/**
 * Adds a vertical line on hover to show currently hovered X position on line charts
 * @returns
 */
Chart.prototype.addHoverLine = function () {
  function createSelection(parentSelection) {
    return parentSelection.append("line").attr("class", "chart__hover-line");
  }
  function createRenderer(selection, chart) {
    return function () {
      if (chart.hovered) {
        selection
          .transition()
          .duration(200)
          .ease(d3.easeLinear)
          .attr("stroke-opacity", 1)
          .attr("x1", (d) => {
            return chart.xScale(chart.hovered.x);
          })
          .attr("x2", (d) => {
            return chart.xScale(chart.hovered.x);
          })
          .attr("y1", 0)
          .attr("y2", chart.getInnerHeight());
      } else {
        selection.transition().duration(200).attr("stroke-opacity", 0);
      }
    };
  }
  this.addElement("hoverLine", "data", createSelection, createRenderer);
  return this;
};

/**
 * Adds a hover dot to the nearest hovered point on line charts
 * @returns
 */
Chart.prototype.addHoverDot = function () {
  function createSelection(parentSelection) {
    return parentSelection.append("circle").attr("class", "chart__hover-dot");
  }
  function createRenderer(selection, chart) {
    return function () {
      if (chart.hovered && chart.lineData) {
        var hoverIndex = chart.lineData.findIndex(function (d) {
          return d[0][2] === chart.hovered.name;
        });
        selection
          .attr(
            "class",
            "chart__hover-dot chart__hover-dot--" +
              (chart.lineData.length - hoverIndex - 1)
          )
          .attr("cx", function (d) {
            return chart.xScale(chart.hovered.x);
          })
          .attr("cy", function (d) {
            return chart.yScale(chart.hovered.y);
          })
          .attr("r", 5)
          .attr("fill-opacity", 1);
      } else {
        selection.attr("r", 0).attr("fill-opacity", 0);
      }
    };
  }
  this.addElement("hoverDot", "data", createSelection, createRenderer);
  return this;
};

/**
 * Adds groups of bars to the chart
 * @param {function} selector function that takes the chart data and returns the bar data
 */
Chart.prototype.addBarGroups = function (overrides) {
  var _this = this;

  const options = { ...this.options, ...overrides };

  const createSelection = (parentSelection) => {
    return parentSelection.append("g").attr("class", "chart__bargroups");
  };

  const createRenderer = (selection, chart) => {
    return function () {
      // shape data for bar groups
      var barData = d3
        .groups(_this.data, (d) => d.x)
        .map((d) => ({
          group: d[0],
          values: d[1].map((d) => ({ ...d, x: d.group, y: d.y })),
        }));
      var spacing = _this.options.barSpacing || 0;
      var typeNames = barData[0].values.map((d) => d.x);

      _this.colorScale = d3
        .scaleOrdinal()
        .domain(typeNames)
        .range(options.colors);

      _this.groupScale = _this.xScale;

      _this.barScale = d3
        .scaleBand()
        .domain(typeNames)
        .range([0, _this.groupScale.bandwidth()])
        .round(0)
        .padding(0);

      // make bar groups
      var parentSelection = selection
        .selectAll(".chart__bar--group")
        .data(barData);
      var groupSelection = parentSelection
        .enter()
        .append("g")
        .attr("id", function (d) {
          return "bar-group" + d.group;
        })
        .attr("class", function (d) {
          return "chart__bar--group " + d.group;
        })
        .attr("transform", function (d) {
          return "translate(" + _this.groupScale(d.group) + ",0)";
        })
        .merge(parentSelection)
        .attr("transform", function (d) {
          return "translate(" + _this.groupScale(d.group) + ",0)";
        });

      if (options.renderTooltip) {
        // make overlay bar groups for tooltips
        var groupAreaSelection = selection
          .selectAll(".chart__bar-area")
          .data(barData);
        groupAreaSelection
          .enter()
          .append("rect")
          .attr("fill", "transparent")
          .attr("class", "chart__bar-area")
          .on("mousemove", function (event, d) {
            chart.setHovered(d);
            chart.showTooltip(event, options.renderTooltip);
          })
          .on("mouseout", function () {
            chart.setHovered(null);
            chart.hideTooltip();
          })
          .merge(groupAreaSelection)
          .attr("x", function (d, i) {
            return _this.groupScale(d.group) - 4;
          })
          .attr("y", 0)
          .attr("height", _this.getInnerHeight())
          .attr("width", _this.groupScale.bandwidth() + 8);
      }

      // make bars
      var barDataSelection = groupSelection
        .selectAll(".chart__bar")
        .data(function (d) {
          return d.values;
        });
      barDataSelection
        .enter()
        .append("rect")
        .attr("class", function (d, i) {
          return "chart__bar chart__bar--bar" + i;
        })
        .attr("width", function (d) {
          return _this.barScale.bandwidth() - spacing;
        })
        .attr("x", function (d) {
          return _this.barScale(d.x);
        })
        .attr("height", 0)
        .attr("y", function (d) {
          return _this.getInnerHeight();
        })
        .merge(barDataSelection)
        .transition()
        .duration(1000)
        .attr("width", function (d) {
          return _this.barScale.bandwidth() - spacing;
        })
        .attr("x", function (d) {
          return _this.barScale(d.x);
        })
        .attr("y", function (d) {
          return _this.yScale(d.y);
        })
        .attr("height", function (d) {
          return _this.getInnerHeight() - _this.yScale(d.y);
        })
        .attr("fill", (d, i) => _this.colorScale(d.group));
    };
  };

  this.addElement("bargroups", "data", createSelection, createRenderer);
  return this;
};

/**
 * Adds bars to the chart for time based axis
 * @param {function} selector function that takes the chart data and returns the bar data
 */
Chart.prototype.addBars = function (overrides) {
  var _this = this;
  var options = overrides || {};
  options.selector =
    overrides.selector ||
    function (data) {
      return [
        data.map(function (d) {
          return [d.x, d.y, d.name];
        }),
      ];
    };
  this.selections["bars"] = this.selections["data"]
    .append("g")
    .attr("class", "chart__bars");

  this.updaters["bars"] = function () {
    var barData = options.selector(_this.data);

    var spacing = 2;
    var bandWidth =
      _this.xScale(barData[1][0]) - _this.xScale(barData[0][0]) - spacing * 2;

    var selection = _this.selections["bars"]
      .selectAll(".chart__bar")
      .data(barData);

    selection
      .enter()
      .append("rect")
      .attr("class", "chart__bar")
      .attr("x", function (d) {
        return _this.xScale(d[0]) + spacing;
      })
      .attr("width", bandWidth)
      .attr("y", _this.getInnerHeight())
      .attr("height", 0)
      .merge(selection)
      .transition()
      .duration(1000)
      .attr("x", function (d) {
        return _this.xScale(d[0]) + spacing;
      })
      .attr("width", bandWidth)
      .attr("y", function (d) {
        return _this.yScale(d[1]);
      })
      .attr("height", function (d) {
        return _this.getInnerHeight() - _this.yScale(d[1]);
      });
  };

  return this;
};

/**
 * Adds bars to the chart for category or location based axis
 * @param {function} selector function that takes the chart data and returns the bar data
 */
Chart.prototype.addBandedBars = function (overrides) {
  var _this = this;
  var options = overrides || {};
  options.renderTooltip = overrides.renderTooltip;
  options.selector =
    overrides.selector ||
    function (data) {
      return [
        data.map(function (d) {
          return [d.x, d.y, d.name];
        }),
      ];
    };

  function createSelection(parentSelection) {
    return parentSelection.append("g").attr("class", "chart__bars");
  }
  function createRenderer(currentSelection, chart) {
    return function () {
      var barData = options.selector(_this.data);
      var bandWidth = _this.xScale.bandwidth();
      var selection = currentSelection.selectAll(".chart__bar").data(barData);
      selection
        .enter()
        .append("rect")
        .attr("class", "chart__bar")
        .attr("x", function (d) {
          return _this.xScale(d[0]);
        })
        .attr("width", bandWidth)
        .attr("y", _this.getInnerHeight())
        .attr("height", 0)
        .on("mousemove", function (event, d) {
          chart.setHovered(d);
          options.renderTooltip &&
            chart.showTooltip(event, options.renderTooltip);
        })
        .on("mouseout", function (event, d) {
          chart.setHovered(null);
          options.renderTooltip && chart.hideTooltip();
        })
        .merge(selection)
        .transition()
        .duration(1000)
        .attr("x", function (d) {
          return _this.xScale(d[0]);
        })
        .attr("width", bandWidth)
        .attr("y", function (d) {
          return _this.yScale(d[1]);
        })
        .attr("height", function (d) {
          return _this.getInnerHeight() - _this.yScale(d[1]);
        });
    };
  }

  this.addSelection("bandedBars", "data", createSelection);
  this.addRenderFunction("bandedBars", createRenderer);
  return this;
};

/**
 * Adds lines to the chart
 * @param {function} selector a function that accepts chart data and returns the line data
 */
Chart.prototype.addLines = function (overrides) {
  var _this = this;
  var options = { ...this.options, ...overrides };
  options.delay = overrides.delay || 0;
  options.duration = overrides.duration || 2000;
  options.linesId = overrides.linesId || "lines";
  options.selector =
    overrides.selector ||
    function (data) {
      return [
        data.map(function (d) {
          return [d.x, d.y];
        }),
      ];
    };

  if (_this.getSelection(options.linesId))
    throw new Error(
      "addLines: selection already exists for given linesId " + options.linesId
    );
  function createLineSelection(parentSelection) {
    return parentSelection.append("g").attr("class", "chart__lines");
  }
  function createLineRenderer(selection, chart) {
    return function () {
      const typeNames = d3.groups(_this.data, (d) => d.group).map((d) => d[0]);
      if (options.colorMap) {
        _this.colorScale = d3
          .scaleOrdinal()
          .domain(Object.keys(options.colorMap))
          .range(Object.values(options.colorMap));
      } else {
        _this.colorScale = d3
          .scaleOrdinal()
          .domain(typeNames)
          .range(options.colors);
      }
      _this.lineData = options.selector(_this.data);
      var line = d3
        .line()
        .x(function (d) {
          return chart.xScale(d[0]);
        })
        .y(function (d) {
          return chart.yScale(d[1]);
        });
      if (options.curve) line.curve(options.curve);
      var lines = selection.selectAll(".chart__line").data(chart.lineData);

      lines
        .enter()
        .append("path")
        .attr("class", function (d, i) {
          return "chart__line chart__line--" + (chart.lineData.length - i - 1);
        })
        .attr("d", line)
        .attr("data-id", function (d) {
          return d[0][2];
        })
        .style("stroke-dasharray", function () {
          return this.getTotalLength();
        })
        .style("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .merge(lines)
        .transition()
        .duration(options.duration)
        .delay(options.delay)
        .attr("d", line)
        .attr("stroke", function (d) {
          return _this.colorScale(d[0][2]);
        })
        .style("stroke-dasharray", function () {
          return "10000px";
        })
        .style("stroke-dashoffset", 0);

      // track min width for dash array ratio
      chart.lastWidth = chart.lastWidth
        ? Math.min(chart.lastWidth, chart.getInnerWidth())
        : chart.getInnerWidth();
    };
  }
  this.addSelection(options.linesId, "data", createLineSelection);
  this.addRenderFunction(options.linesId, createLineRenderer);
  return this;
};

Chart.prototype.addStackArea = function (overrides) {
  var _this = this;
  var options = overrides || {};
  options.stackId = overrides.stackId || "stacks";
  _this.stackData = options.series;
  function createAreaSelection(parentSelection) {
    return parentSelection.append("g").attr("class", "chart__stacks");
  }
  function createAreaRenderer(selection, chart) {
    return function () {
      var area = d3
        .area()
        .x(function (d) {
          return chart.xScale(d.data.x);
        })
        .y0(function (d) {
          return chart.yScale(d[0]);
        })
        .y1(function (d) {
          return chart.yScale(d[1]);
        });

      var areaSelection = selection.selectAll("path").data(chart.stackData);

      areaSelection
        .enter()
        .append("path")
        .attr("class", function (d, i) {
          return "chart__area chart__area--" + i;
        })
        .merge(areaSelection)
        .attr("d", area);
    };
  }

  this.addElement(
    options.stackId,
    "data",
    createAreaSelection,
    createAreaRenderer
  );
  return this;
};

/**
 * Adds a Y axis to the chart
 * @param {*} selector a function that accepts a data entry and returns the y value
 */
Chart.prototype.addAxisY = function (overrides) {
  var _this = this;
  var options = overrides || {};
  // selector for y data value
  options.selector =
    overrides.selector ||
    function (d) {
      return d.y;
    };
  // option to modify extent, do not modify by default
  options.adjustExtent =
    overrides.adjustExtent ||
    function (e) {
      return e;
    };
  this.selections["yAxis"] = this.selections["overlay"]
    .append("g")
    .attr("class", "chart__axis chart__axis--y");
  this.updaters["yAxis"] = function () {
    var extent = options.selector && d3.extent(_this.data, options.selector);
    var yExtent = options.adjustExtent(extent);
    _this.yScale = d3
      .scaleLinear()
      .rangeRound([_this.getInnerHeight(), 0])
      .domain(yExtent)
      .nice();
    var yAxis = d3.axisLeft(_this.yScale);
    if (options.ticks) yAxis.ticks(options.ticks);
    if (options.tickFormat) yAxis.tickFormat(options.tickFormat);
    // add axis
    _this.selections["yAxis"]
      .attr("transform", "translate(0, 0)")
      .transition()
      .duration(1000)
      .call(yAxis);
  };
  return this;
};

/**
 * Adds a Y axis to the chart
 * @param {*} selector a function that accepts a data entry and returns the y value
 */
Chart.prototype.addGridLines = function (overrides) {
  var _this = this;
  var options = overrides || {};
  this.selections["gridLines"] = this.selections["base"]
    .append("g")
    .attr("class", "chart__grid-lines");
  this.updaters["gridLines"] = function () {
    var yAxis = d3
      .axisLeft(_this.yScale)
      .tickSize(-1 * _this.getInnerWidth())
      .tickFormat("");
    if (options.ticks) yAxis.ticks(options.ticks);
    // add axis
    _this.selections["gridLines"]
      .attr("transform", "translate(0, 0)")
      .transition()
      .duration(options.duration || 1000)
      .call(yAxis);
  };
  return this;
};

Chart.prototype.addMarklines = function (overrides = {}) {
  // marklines { axis, value }
  const _this = this;
  const options = { ..._this.options, ...overrides };
  // do nothing if no marklines
  if (!options.marklines) return this;

  options.markId = makeId();

  // create group for marklines and return selection
  function createMarklineSelection(parentSelection) {
    return parentSelection.append("g").attr("class", "chart__marklines");
  }
  // create render function for marklines
  function createMarklineRenderer(selection, chart) {
    return function () {
      const options = { ...chart.options, ...overrides };
      const lineData = options.marklines.filter((d) => d.axis === "y");
      // TODO: implement marklines for x axis when needed
      if (lineData.length < options.marklines.length)
        console.warn(
          "only marklines for values on the y axis are currently supported."
        );
      if (!_this.yScale) {
        console.warn("need y scale to render marklines, call addAxisY first.");
        return;
      }
      var lines = selection
        .selectAll(".chart__markline")
        .data(lineData, (d) => d.id);
      lines
        .enter()
        .append("line")
        .attr("class", function (d, i) {
          return "chart__markline";
        })
        .attr("x1", 0)
        .attr("y1", (d) => _this.yScale(d.value))
        .attr("x2", 0)
        .attr("y2", (d) => _this.yScale(d.value))
        .merge(lines)
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("x1", 0)
        .attr("y1", (d) => _this.yScale(d.value))
        .attr("x2", chart.getInnerWidth())
        .attr("y2", (d) => _this.yScale(d.value));

      lines.exit().transition().duration(400).style("opacity", 0).remove();
    };
  }
  this.addElement(
    options.markId,
    "data",
    createMarklineSelection,
    createMarklineRenderer
  );
  return this;
};

/**
 * Adds an axis for bar charts
 * @param {*} selector a function that accepts a data entry and returns the y value
 */
Chart.prototype.addBarAxis = function (overrides) {
  var _this = this;
  var options = overrides || {};
  options.position = overrides.position || "bottom";
  // selector for bar value
  options.selector =
    overrides.selector ||
    function (d) {
      return d.x;
    };
  // option to adjust axis labels, do nothing by default
  options.adjustLabels = overrides.adjustLabels || function () {};
  this.selections["barAxis"] = this.selections["base"]
    .append("g")
    .attr("class", "chart__axis chart__axis--bar");
  this.updaters["barAxis"] = function () {
    _this.xScale = d3
      .scaleBand()
      .domain(_this.data.map(options.selector))
      .range([0, _this.getInnerWidth()])
      .round(0.1)
      .padding(0.2);
    var axis = getAxisFunction(options.position);
    var barAxis = axis(_this.xScale);
    _this.selections["barAxis"]
      .attr("transform", "translate(0," + _this.getInnerHeight() + ")")
      .transition()
      .duration(1000)
      .call(barAxis)
      .call(options.adjustLabels.bind(_this));
  };
  return this;
};

/**
 * Adds an axis used for grouped bar charts
 * @param {*} overrides
 * @returns
 */
Chart.prototype.addBarGroupAxis = function (overrides) {
  // console.log('addBarGroupAxis, ', this)
  var _this = this;
  var options = overrides || {};
  // selector for x data value
  options.selector =
    overrides.selector ||
    function (d) {
      return d.x;
    };
  // option to modify extent, do not modify by default
  options.adjustExtent =
    overrides.adjustExtent ||
    function (e) {
      return e;
    };
  // option to adjust axis labels, do nothing by default
  options.adjustLabels = overrides.adjustLabels || function () {};

  this.selections["barGroup"] = this.selections["overlay"]
    .append("g")
    .attr("class", "chart__axis chart__axis--x");
  this.updaters["barGroup"] = function () {
    var innerWidth =
      _this.options.width - _this.options.margin[1] - _this.options.margin[3];
    const domain = d3.groups(_this.data, (d) => d.x).map((d) => d[0]);
    _this.xScale = d3
      .scaleBand() // projecting discrete data into the diagram
      .domain(domain)
      .range([0, innerWidth])
      .round(0.1)
      .padding(_this.options.groupPadding || 0.1);
    var xAxis = d3.axisBottom(_this.xScale).tickSize(8).tickSizeOuter(0);
    _this.selections["barGroup"]
      .attr("transform", "translate(0," + _this.getInnerHeight() + ")")
      .transition()
      .duration(1000)
      .call(xAxis)
      .call(options.adjustLabels.bind(_this));
  };
  return this;
};

/**
 * Adds a time (X) axis to the chart
 * @param {*} selector function that accepts a data entry and returns the X time value
 */
Chart.prototype.addTimeAxis = function (overrides) {
  var _this = this;
  var options = overrides || {};
  // selector for x data value
  options.selector =
    overrides.selector ||
    function (d) {
      return d.x;
    };
  // option to modify extent, do not modify by default
  options.adjustExtent =
    overrides.adjustExtent ||
    function (e) {
      return e;
    };
  // option to adjust axis labels, do nothing by default
  options.adjustLabels = overrides.adjustLabels || function () {};

  this.selections["timeAxis"] = this.selections["overlay"]
    .append("g")
    .attr("class", "chart__axis chart__axis--time");
  this.updaters["timeAxis"] = function () {
    var extent = d3.extent(_this.data, options.selector);
    var xExtent = options.adjustExtent(extent);
    _this.xScale = d3
      .scaleTime()
      .rangeRound([0, _this.getInnerWidth()])
      .domain(xExtent);
    var xAxis = d3.axisBottom(_this.xScale).tickSize(8).tickSizeOuter(0);
    if (options.ticks) xAxis.ticks(options.ticks);
    if (options.tickFormat) xAxis.tickFormat(options.tickFormat);
    _this.selections["timeAxis"]
      .attr("transform", "translate(0," + _this.getInnerHeight() + ")")
      .transition()
      .duration(1000)
      .call(xAxis)
      .call(options.adjustLabels.bind(_this));
  };
  return this;
};

/**
 * Adds a legend to the chart
 * @param {*} items
 * @returns
 */
Chart.prototype.addLegend = function (items) {
  // var _this = this;
  // if (items) {
  //   var children = items.map(function (item, i) {
  //     return (
  //       "<div class='legend-item legend-item--" +
  //       i +
  //       "'><div class='legend-item__color'></div><div class='legend-item__label'>" +
  //       item +
  //       "</div></div>"
  //     );
  //   });
  //   $(_this.svgEl)
  //     .parent()
  //     .append("<div class='legend'>" + children.join("") + "</div>");
  // }
  return this;
};

/**
 * Adds a voronoi layer to the data group
 * Used for showing tooltips for the nearest hover point
 * @param {*} overrides
 * @returns
 */
Chart.prototype.addVoronoi = function (overrides = {}) {
  var _this = this;
  var options = { ..._this.options, ...overrides };
  options.xSelector =
    options.xSelector ||
    function (d) {
      return d.x;
    };
  options.ySelector =
    options.ySelector ||
    function (d) {
      return d.y;
    };
  this.voronoi = voronoi()
    .x(function (d) {
      return _this.xScale(options.xSelector(d));
    })
    .y(function (d) {
      return _this.yScale(options.ySelector(d));
    })
    .extent([
      [0, 0],
      [_this.getInnerWidth(), _this.getInnerHeight()],
    ]);
  function createSelection(parentSelection) {
    return parentSelection.append("g").attr("class", "chart__voronoi");
  }
  function createRenderer(selection, chart) {
    return function () {
      function renderTooltip(hoverData) {
        var yFormat = d3.format(
          chart.options.yTooltipFormat || options.yFormat || ",d"
        );
        var xFormat = d3.timeFormat(
          chart.options.xTooltipFormat || options.xFormat || ",d"
        );
        function getDefaultTooltip() {
          return {
            title: hoverData.group,
            xValue: xFormat(options.xSelector(hoverData)),
            yValue: yFormat(options.ySelector(hoverData)),
            data: hoverData.data,
          };
        }
        const data = getDefaultTooltip();

        const valueTemplate =
          chart.options.valueTemplate ||
          "<span>{{xValue}}:</span> <span>{{yValue}}</span>";

        const tooltipTemplate =
          '<h1 class="tooltip__title">{{title}}</h1>' +
          '<div class="tooltip__item">' +
          valueTemplate +
          "</div>";
        return Mustache.render(tooltipTemplate, data);
      }
      chart.voronoi
        .x(function (d) {
          return _this.xScale(options.xSelector(d));
        })
        .y(function (d) {
          return _this.yScale(options.ySelector(d));
        })
        .extent([
          [0, 0],
          [_this.getInnerWidth(), _this.getInnerHeight()],
        ]);
      var voronoiData = chart.voronoi.polygons(chart.data);
      var voronoi = selection.selectAll("path").data(voronoiData);
      voronoi
        .enter()
        .append("path")
        .merge(voronoi)
        .attr("d", function (d) {
          return d ? "M" + d.join("L") + "Z" : null;
        })
        .on("mousemove", function (event, d) {
          chart.setHovered(d.data);
          chart
            .getSelection("root")
            .select("path[data-id='" + d.data.name + "']")
            .classed("chart__line--hovered", true);
          chart.showTooltip(event, renderTooltip);
          var renderLine = chart.getRenderer("hoverLine");
          renderLine && renderLine();
          var renderDot = chart.getRenderer("hoverDot");
          renderDot && renderDot();
        })
        .on("mouseout", function (event, d) {
          chart.setHovered(null);
          chart
            .getSelection("root")
            .select("path[data-id='" + d.data.name + "']")
            .classed("chart__line--hovered", false);
          chart.hideTooltip();
          var renderLine = chart.getRenderer("hoverLine");
          renderLine && renderLine();
          var renderDot = chart.getRenderer("hoverDot");
          renderDot && renderDot();
        });
    };
  }
  this.addElement("voronoi", "data", createSelection, createRenderer);
  return this;
};

Chart.prototype.addDonut = function (overrides) {
  var _this = this;
  const options = { ...this.options, ...overrides };
  const createSelection = (parentSelection) => {
    return parentSelection
      .append("g")
      .attr("class", "chart__donut")
      .attr(
        "transform",
        `translate(${_this.getInnerWidth() / 2} ${_this.getInnerHeight() / 2})`
      );
  };
  const createRenderer = (selection, chart) => () => {
    _this.colorScale = d3
      .scaleOrdinal()
      .domain(chart.data.map((d) => d.group))
      .range(options.colors);
    const pie = d3
      .pie()
      .padAngle(0.016) // padding between donut arcs
      .sort(null)
      .value((d) => d.value);
    const radius = Math.min(chart.getInnerWidth(), chart.getInnerHeight()) / 2;
    const arc = d3
      .arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);
    const arcs = pie(chart.data);
    const arcSelection = selection.selectAll("path").data(arcs);
    const arcEnter = arcSelection
      .enter()
      .append("path")
      // .attr("d", (d, i) => arc(startArcs[i]))
      .attr("fill", (d) => _this.colorScale(d.data.group))
      .on("mousemove", function (event, d) {
        chart.setHovered(d);
        options.renderTooltip &&
          chart.showTooltip(event, options.renderTooltip);
      })
      .on("mouseout", function (event, d) {
        chart.setHovered(null);
        options.renderTooltip && chart.hideTooltip();
      });

    arcEnter
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        // console.log({ d };
        var i = d3.interpolate(d.startAngle + 0.01, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });
  };
  this.addElement("donut", "data", createSelection, createRenderer);
  return this;
};

/**
 * Adds a custom element to the chart
 * @param {function} renderElement accepts the chart object and renders an element
 */
Chart.prototype.addCustom = function (renderElement) {
  var _this = this;
  renderElement(_this);
  return this;
};

/**
 * Utility function that calculates the width of a month on the chart in pixels
 */
Chart.prototype.monthToPixels = function (num) {
  var now = new Date();
  var start = d3.timeDay.floor(now);
  var end = d3.timeDay.offset(start, 30);
  var width = this.xScale(end) - this.xScale(start);
  return width * num;
};

/**
 * Renders the chart
 */
Chart.prototype.render = function () {
  Object.values(this.updaters).forEach(function (r) {
    r();
  });
  return this;
};

/**
 * Updates the chart options and re-renders
 * @param {*} options
 */
Chart.prototype.update = function ({ data, options }) {
  if (options) this.options = { ...this.options, ...options };
  if (data) this.data = data;
  this.render();
  return this;
};

export default Chart;
