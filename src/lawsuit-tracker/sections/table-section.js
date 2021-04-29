import React, { useCallback, useState } from "react";
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
  withStyles,
} from "@material-ui/core";
import TwoColBlock from "../../components/sections/two-col-block";
import {
  applyFilter,
  getDateRange,
  getTrackerUrl,
  shapeCounties,
  shapeStates,
  shapeStatesCounties,
  shapeTracts,
  sortData,
} from "../utils";
import * as d3 from "d3";
import { Button } from "gatsby-material-ui-components";
import Table from "../table/table";
import TrendLine from "../table/trend-line";
import SearchIcon from "@material-ui/icons/Search";

const SectionBlock = withStyles((theme) => ({
  root: {
    "& .controls": {
      marginTop: theme.spacing(3),
    },
  },
}))(TwoColBlock);

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
    default:
      throw new Error("unsupported view");
  }
};

const VALID_TYPES = ["name", "lawsuits", "default_judgement"];
const FORMATTER = d3.format(",~d");
const FORMAT_NUM = (v) => (v === null ? "-" : FORMATTER(v));

const MONTH_PARSE = d3.timeParse("%m/%Y");
const dateFormat = d3.timeFormat("%B %d, %Y");

function getTrendData(data) {
  return data.map((d) => ({ x: MONTH_PARSE(d.month), y: Number(d.lawsuits) }));
}

const TableSection = ({
  title,
  description,
  views = ["tracts"],
  data: source,
  children,
  ...props
}) => {
  const [sourceData, setSourceData] = useState(source);
  const [sortBy, setSortBy] = useState("lawsuits");
  const [ascending, setAscending] = useState(false);
  const [filter, setFilter] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [view, setView] = useState(views[0]);
  const dataShaper = getShaperForView(view);
  const [data, setData] = useState(dataShaper(source));
  const filteredData = applyFilter(data, filter);
  let tableData = sortData(filteredData, sortBy, ascending);
  if (view === "counties" || view === "tracts")
    tableData = tableData.slice(0, 10);
  const trendRange = getDateRange(sourceData);

  const handleSort = useCallback(
    (event, key) => {
      if (VALID_TYPES.indexOf(key) === -1) {
        alert("not yet implemented");
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

  const handleFilter = (event) => {
    const value = event.target.value;
    if (value !== filter) setFilter(value);
  };

  const handleViewChange = (event) => {
    const value = event.target.value;
    if (value !== view) setView(value);
    const shaper = getShaperForView(value);
    setData(shaper(sourceData));
  };

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
        accessor: (d) =>
          view === "counties" ? `${d.name}, ${d.state}` : d["name"],
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
            Default Judgements
          </TableSortLabel>
        ),
        cellProps: { align: "right", width: 100 },
        accessor: (d) => FORMAT_NUM(d["default_judgement"]),
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
      view !== "tracts"
        ? {
            id: "report",
            Header: "",
            cellProps: { style: { minWidth: 120 } },
            Cell: ({ row }) => (
              <Button to={getTrackerUrl(row.original)}>View Report</Button>
            ),
          }
        : null,
    ].filter((v) => !!v);
  }, [handleSort, ascending, sortBy, view]);

  const leftContent = (
    <>
      <Box>
        <Typography variant="sectionTitle" component="h2">
          {title}
        </Typography>
        <Typography>{description}</Typography>
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
    </>
  );
  const rightContent = (
    <Table
      columns={columns}
      data={tableData}
      className={`table--${view}`}
      view={view}
    />
  );
  return <SectionBlock left={leftContent} right={rightContent} {...props} />;
};

export default TableSection;
