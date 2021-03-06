import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Typography from "../../components/typography";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TableSortLabel,
  TextField,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import FlagIcon from "../table/flag-icon";
import TwoColBlock from "../../components/sections/two-col-block";
import {
  applyFilter,
  formatMonthYear,
  getDateRange,
  getSingularRegion,
  getTrackerUrl,
  shapeCounties,
  shapeStates,
  shapeStatesCounties,
  shapeTracts,
  shapeZips,
  sortData,
} from "../utils";
import * as d3 from "d3";
import { Button, GatsbyLink } from "gatsby-material-ui-components";
import Table from "../table/table";
import TrendLine from "../table/trend-line";
import SearchIcon from "@material-ui/icons/Search";
import Mustache from "mustache";

const SectionBlock = withStyles((theme) => ({
  root: {
    "& .fader": {
      zIndex: 11,
      pointerEvents: 'none',
      display: 'flex',
      position: 'absolute',
      top: 0,
      right: 10,
      height: '100%',
      width: 100,
      background: 'linear-gradient(90deg, transparent, white)',
      writingMode: 'vertical-rl',
      color: '#595247',
      opacity: 1,
      transition: 'opacity .5s',
      '&.hide': {
        opacity: 0,
      },
      '& > svg': {
        marginRight: 3,
        marginBottom: 5,
      },
      '& .content': {
        top: "64px",
        //subtract 64 for header height
        height: "calc(100vh - 64px)",
        textAlign: "center",
        position: "sticky",
      },
    },
    "& .controls": {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    "& .control": {
      marginTop: theme.spacing(3),
    },
    "& .MuiGrid-root.MuiGrid-container": {
      alignItems: "flex-start", // required for sticky side column
    },
    [theme.breakpoints.up("md")]: {
      "& .MuiGrid-root.MuiGrid-item:first-child": {
        position: "sticky",
        top: 64,
        paddingRight: theme.spacing(6),
      },
    },
    "& .hint-button": {
      position: "relative",
      margin: theme.spacing(2, 0, 2, -1),
      fontWeight: 500,
      color: "#595247",
      lineHeight: 1,
      "&:before": {
        content: "'?'",
        display: "inline-block",
        minWidth: 16,
        height: 16,
        backgroundColor: "#efece6",
        marginRight: 8,
        lineHeight: "18px",
        fontSize: 12,
        borderRadius: 16,
        marginTop: -2,
      },
    },
  },
}))(TwoColBlock);

/**
 * Returns a function that shapes the data based on the provided view
 * @param {string} view
 * @returns {function}
 */
const getShaperForView = (view) => {
  switch (view) {
    case "nested":
      return shapeStatesCounties;
    case "states":
      return shapeStates;
    case "counties":
      return shapeCounties;
    case "tracts":
      return shapeTracts;
    case "zips":
      return shapeZips;
    default:
      throw new Error("unsupported view");
  }
};

/**
 * Returns data for the trend line
 * @param {*} data
 * @returns {Array<object>} [{x, y}]
 */
function getTrendData(data) {
  return data.map((d) => ({ x: MONTH_PARSE(d.month), y: Number(d.lawsuits) }));
}

/** Valid sort types */
const VALID_TYPES = ["name", "lawsuits", "default_judgement"];

/** Number formatter */
const FORMATTER = d3.format(",~d");

/** Format wrapper that handles null values */
const FORMAT_NUM = (v) => (v === null ? "-" : FORMATTER(v));

/** Parser for month dates */
const MONTH_PARSE = d3.timeParse("%m/%Y");

const getTooltipHint = (content, hasIndiana) => {
  if (hasIndiana) {
    return (
      content.DEFAULT_JUDGEMENTS_HINT +
      `<br /><br />Default judgments are not recorded by the state of Indiana.`
    );
  }
  return content.DEFAULT_JUDGEMENTS_HINT;
};

const getDisproportionateTooltip = (groups) => {
  let groupList = "";
  if (groups.length === 1) groupList = groups[0];
  if (groups.length === 2) groupList = groups[0] + " and " + groups[1];
  if (groups.length > 2) {
    const last = groups.pop();
    groupList = groups.join(", ") + " and " + last;
  }
  return `Disproportionate filings against ${groupList} neighborhoods in this county.`;
};

const PlaceName = ({ row, view }) => {
  const name =
    view === "counties"
      ? `${row.original.name}`
      : row.original["name"];
  const hasDisproportionate = row.original.disproportionate?.length > 0;
  const nameComponent = (
    <Box
      display="inline-flex"
      alignItems="center"
      style={{ whiteSpace: "nowrap", lineHeight: 1.1 }}
    >
      {name}{" "}
      {hasDisproportionate && (
        <FlagIcon style={{ fontSize: 16, marginLeft: 8 }} />
      )}
    </Box>
  );
  return hasDisproportionate ? (
    <Tooltip
      title={getDisproportionateTooltip(row.original.disproportionate)}
      arrow
      placement="right"
    >
      {nameComponent}
    </Tooltip>
  ) : (
    nameComponent
  );
};

/**
 * A section with a left column for title, description, and table controls
 * and a table on the right.
 */
const TableSection = ({
  views,
  data: source,
  cols,
  limit,
  content,
  onJumpToMap,
  onCloseJumpTo,
  children,
  ...props
}) => {
  /** metric to sort by */
  const [sortBy, setSortBy] = useState("lawsuits");
  /** sorting order */
  const [ascending, setAscending] = useState(false);
  /** filter string for table */
  const [filter, setFilter] = useState("");
  /** current table view (nested, states, counties, zips) */
  const [view, setView] = useState(views[0]);
  /** function that shapes data for the current view */
  const dataShaper = getShaperForView(view);
  /** table data */
  const [data, setData] = useState(dataShaper(source));
  /** table data with filter applied */
  const filteredData = applyFilter(data, filter);
  /** sorted and filtered table data */
  let tableData = sortData(filteredData, sortBy, ascending);
  /** limited rows for specific views when limit is specified  */
  if (view === "counties" || view === "tracts" || (view === "zips" && limit))
    tableData = tableData.slice(0, limit);
  /** range of dates used for trend lines */
  const trendRange = getDateRange(source);
  /** check if table contains data for indiana so we can flag default judgements are unavailable */
  const hasIndiana =
    data.filter(
      (d) =>
        d.state === "Indiana" ||
        d.name === "Indiana" ||
        d.geoid.indexOf("18") === 0
    ).length > 0;
  const tooltipHint = getTooltipHint(content, hasIndiana);
  /** memoized handler for when user changes sorting */
  const handleSort = useCallback(
    (event, key) => {
      if (VALID_TYPES.indexOf(key) === -1) {
        console.error("tried to sort invalid param");
        return;
      }
      if (sortBy === key) {
        setAscending(!ascending);
      }
      if (sortBy !== key) {
        setSortBy(key);
        setAscending(false);
      }
    },
    [sortBy, ascending, setSortBy, setAscending]
  );

  /** handler for when user types in the filter input */
  const handleFilter = (event) => {
    const value = event.target.value;
    if (value !== filter) setFilter(value);
  };

  /** handler for when user changes view */
  const handleViewChange = (event) => {
    const value = event.target.value;
    if (value !== view) setView(value);
    const shaper = getShaperForView(value);
    setData(shaper(source));
  };

  /** columns for table (must be memoized!) */
  const columns = React.useMemo(() => {
    return [
      {
        id: "name",
        Header: () => (
          <TableSortLabel
            active={sortBy === "name"}
            direction={sortBy === "name" ? (ascending ? "asc" : "desc") : "asc"}
            onClick={(e) => handleSort(e, "name")}
          >
            Name
          </TableSortLabel>
        ),
        cellProps: { width: "50%" },
        Cell: ({ row }) => <PlaceName row={row} view={view} />,
      },
      {
        id: "lawsuits",
        Header: () => (
          <TableSortLabel
            active={sortBy === "lawsuits"}
            direction={
              sortBy === "lawsuits" ? (ascending ? "asc" : "desc") : "asc"
            }
            onClick={(e) => handleSort(e, "lawsuits")}
          >
            Lawsuits
          </TableSortLabel>
        ),
        cellProps: { align: "right" },
        accessor: (d) => FORMAT_NUM(d["lawsuits"]),
      },
      {
        id: "trend",
        Header: () => (
          <>
            Lawsuits Trend
            <br />
            <Typography variant="caption">
              {trendRange.map((d) => d3.timeFormat("%b '%y")(d)).join(" - ")}
            </Typography>
          </>
        ),
        cellProps: {
          className: "col--trend",
          align: "center",
          width: 166,
        },
        Cell: ({ row }) =>
          row.original.name === "Texas" ? (
            "-"
          ) : (
            <TrendLine
              range={trendRange}
              data={getTrendData(row.original.lawsuit_history)}
            />
          ),
      },

      {
        id: "default_judgement",
        Header: () => (
          <TableSortLabel
            active={sortBy === "default_judgement"}
            direction={
              sortBy === "default_judgement"
                ? ascending
                  ? "asc"
                  : "desc"
                : "asc"
            }
            onClick={(e) => handleSort(e, "default_judgement")}
          >
            <Tooltip
              title={
                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{
                    __html: tooltipHint,
                  }}
                />
              }
              placement="top"
              interactive
              arrow
            >
              <span>Default Judgments</span>
            </Tooltip>
          </TableSortLabel>
        ),
        cellProps: { align: "right", width: 100 },
        accessor: (d) => FORMAT_NUM(d["default_judgement"]),
      },
      onJumpToMap
        ? {
            id: "jump-to",
            Header: "",
            cellProps: {className: "col--jump"},
            Cell: ({ row }) => (
              <Button onClick={() => onJumpToMap(row.original)} component={GatsbyLink}>
                Jump to map
              </Button>
            ),
          }
        : null,
      view !== "tracts" && view !== "zips"
        ? {
            id: "report",
            Header: "",
            cellProps: { style: { minWidth: 120 }, className:"col--view" },
            Cell: ({ row }) =>
              row.original.name !== "Texas" ? (
                <Button component={GatsbyLink} to={getTrackerUrl(row.original)}>
                  View Report
                </Button>
              ) : (
                "-"
              ),
          }
        : null,
    ].filter((v) => !!v && cols.indexOf(v.id) > -1);
  }, [handleSort, ascending, sortBy, view, trendRange, cols, tooltipHint, onJumpToMap]);

  const context = {
    singularRegion: getSingularRegion(view),
    name: data[0].state || data[0].county,
    count: data.length,
    view: view === "counties" ? "counties" : "census tracts",
    lastUpdated: formatMonthYear(trendRange[1]),
  };
  const leftContent = (
    <>
      <Box>
        <Typography variant="sectionTitle" component="h2">
          {Mustache.render(content.TITLE, context)}
        </Typography>
        <Typography>{Mustache.render(content.DESCRIPTION, context)}</Typography>
        <Tooltip
          title={
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: tooltipHint,
              }}
            />
          }
          interactive
          arrow
        >
          <Button className="hint-button">What is a default judgment?</Button>
        </Tooltip>
        <Typography paragraph variant="caption">
          {Mustache.render(content.LAST_UPDATED, context)}
        </Typography>
        {children}
      </Box>
      <div className="controls">
        <div className="control">
          <TextField
            id="outlined-search"
            label="Search"
            placeholder="Find a place"
            type="search"
            variant="outlined"
            value={filter}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleFilter}
          />
        </div>
        {views.length > 1 && (
          <div className="control">
            <FormControl component="fieldset">
              <FormLabel component="legend">View</FormLabel>
              <RadioGroup
                aria-label="view type"
                name="view"
                value={view}
                onChange={handleViewChange}
              >
                <FormControlLabel
                  value="nested"
                  control={<Radio />}
                  label="States + Counties"
                />
                <FormControlLabel
                  value="states"
                  control={<Radio />}
                  label="States"
                />
                <FormControlLabel
                  value="counties"
                  control={<Radio />}
                  label="Counties"
                />
              </RadioGroup>
            </FormControl>
          </div>
        )}
      </div>
      {content.FOOTNOTE && (
        <Typography variant="caption" color="grey">
          {Mustache.render(content.FOOTNOTE, context)}
        </Typography>
      )}
    </>
  );
  const rightContent = (
      <Table
        columns={columns}
        data={tableData}
        className={`table--${view}`}
        view={view}
        ascending={ascending}
        sortBy={sortBy}
        content={content}
      />
    );
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

TableSection.defaultProps = {
  views: ["tracts"],
  cols: ["name", "lawsuits", "trend", "default_judgement", "jump-to", "report"],
  limit: 10,
};

TableSection.propTypes = {
  /** array of views to show radio controls for */
  views: PropTypes.array,
  /** columns to display in the table (corresponds to column ids) */
  cols: PropTypes.array,
};

export default TableSection;
