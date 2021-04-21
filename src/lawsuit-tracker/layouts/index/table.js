import React, { useCallback, useEffect, useState } from "react";
import * as d3 from "d3";
import {
  applyFilter,
  sortData,
  shapeStatesCounties,
  shapeStates,
  shapeCounties,
  getTrackerUrl,
} from "../../utils";
import TrendLine from "../../table/trend-line";
import Table from "../../table/table";
import { Block } from "../../../components/sections";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TableSortLabel,
  TextField,
  withStyles,
} from "@material-ui/core";
import Typography from "../../../components/typography";
import { Button } from "gatsby-material-ui-components";
import SearchIcon from "@material-ui/icons/Search";

const VALID_TYPES = ["name", "lawsuits", "default_judgement"];
const FORMATTER = d3.format(",~d");
const FORMAT_NUM = (v) => (v === null ? "-" : FORMATTER(v));

const TableBlock = withStyles((theme) => ({
  root: {
    position: "relative",
    "& h2": {
      marginBottom: theme.spacing(3),
    },
    "& .control": {
      marginBottom: theme.spacing(3),
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
  },
}))(Block);

const MONTH_PARSE = d3.timeParse("%m/%Y");
const dateFormat = d3.timeFormat("%B %d, %Y");

function getTrendData(data) {
  return data.map((d) => ({ x: MONTH_PARSE(d.month), y: Number(d.lawsuits) }));
}

function IndexTable({
  data: source = [],
  trendRange,
  stateCount,
  countyCount,
  lastUpdate,
}) {
  const [sourceData, setSourceData] = useState(source);
  const [data, setData] = useState(shapeStatesCounties(source));
  const [sortBy, setSortBy] = useState("lawsuits");
  const [ascending, setAscending] = useState(false);
  const [filter, setFilter] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [view, setView] = useState("nested");
  const filteredData = applyFilter(data, filter);
  let tableData = sortData(filteredData, sortBy, ascending);
  if (view === "counties") tableData = tableData.slice(0, 25);

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
    if (value === "nested") setData(shapeStatesCounties(sourceData));
    if (value === "states") setData(shapeStates(sourceData));
    if (value === "counties") setData(shapeCounties(sourceData));
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

      {
        id: "report",
        Header: "",
        cellProps: { style: { minWidth: 120 } },
        Cell: ({ row }) => (
          <Button to={getTrackerUrl(row.original)}>View Report</Button>
        ),
      },
    ];
  }, [handleSort, ascending, sortBy, view]);

  // re-shape the source data
  return loaded ? (
    <TableBlock>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography weight="bold" variant="h4" component="h2">
              An Overview of Debt Collection Lawsuits
            </Typography>
            <Typography paragraph>
              In the {stateCount} states and {countyCount} counties we track,
              the table shows an overview of debt collection lawsuits. View the
              report for individual states or counties to get a more detailed
              view, including charts and maps.
            </Typography>
            <Typography variant="caption" paragraph>
              Last updated: {dateFormat(trendRange[1])}
            </Typography>
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
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Table
            columns={columns}
            data={tableData}
            className={`table--${view}`}
            view={view}
          />
        </Grid>
      </Grid>
    </TableBlock>
  ) : (
    "Loading"
  );
}

export default IndexTable;
