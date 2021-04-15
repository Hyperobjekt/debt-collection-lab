import React, { useCallback, useEffect, useState } from "react";
import TableContainer from "./table-container";
import * as d3 from "d3";
import {
  applyFilter,
  sortData,
  makeData,
  shapeStatesCounties,
  shapeStates,
  shapeCounties,
} from "./utils";
import TrendLine from "./trend-line";
import Table from "./table";
import Container from "../../components/layout/container";
import { Block } from "../../components/sections";

const VIEWS = ["nested", "states", "counties "];
const VALID_TYPES = ["name", "lawsuits", "default_judgements"];
const FORMATTER = d3.format(",~d");
const FORMAT_NUM = (v) => (v === null ? "-" : FORMATTER(v));

function FullTable() {
  const [sourceData, setSourceData] = useState([]);
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [ascending, setAscending] = useState(false);
  const [filter, setFilter] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("nested");
  const filteredData = applyFilter(data, filter);
  let tableData = sortData(filteredData, sortBy, ascending);
  if (view === "counties") tableData = tableData.slice(0, 25);

  const handleSort = useCallback(
    (event) => {
      const key = event.target.value;
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
          <button value="name" onClick={handleSort}>
            Name {sortBy !== "name" && "↕"}
            {sortBy === "name" ? (ascending ? "🔽" : "🔼") : ""}{" "}
          </button>
        ),
        accessor: (d) =>
          view === "counties" ? `${d.name}, ${d.state}` : d["name"],
      },
      {
        id: "lawsuits",
        Header: () => (
          <button value="lawsuits" onClick={handleSort}>
            Lawsuits {sortBy !== "lawsuits" && "↕"}{" "}
            {sortBy === "lawsuits" ? (ascending ? "🔽" : "🔼") : ""}
          </button>
        ),
        accessor: (d) => FORMAT_NUM(d["lawsuits"]),
      },
      {
        Header: "Trend",
        Cell: ({ row }) =>
          row.original.name === "Texas" ? "-" : <TrendLine />,
      },
      {
        id: "default_judgements",
        Header: () => (
          <button value="default_judgements" onClick={handleSort}>
            Default Judgements {sortBy !== "default_judgements" && "↕"}
            {sortBy === "default_judgements" ? (ascending ? "🔽" : "🔼") : ""}
          </button>
        ),
        accessor: (d) => FORMAT_NUM(d["default_judgements"]),
      },
      {
        Header: "-",
        Cell: () => <button>View Report</button>,
      },
    ];
  }, [handleSort, ascending, sortBy, view]);

  // load the data
  useEffect(() => {
    makeData().then((sourceData) => {
      const shapedData = shapeStatesCounties(sourceData);
      setSourceData(sourceData);
      setData(shapedData);
      setLoaded(true);
    });
  }, [setData, setLoaded]);

  // re-shape the source data

  return (
    <Block>
      <TableContainer>
        <div className="side">
          <div className="heading">
            <h1>An Overview of Debt Collection Lawsuits</h1>
            <p>
              In the 5 states we track, the table shows an overview of debt
              collection lawsuits. View the report for individual states or
              counties to get a more detailed view, including charts and maps.
            </p>
            <p>Last updated: April 12, 2021</p>
          </div>
          <div className="controls">
            <div className="control">
              <label>Search:</label>
              <br />
              <input
                placeholder="counties or states"
                type="text"
                value={filter}
                onChange={handleFilter}
              />
            </div>
            <div className="control">
              <span>View: </span>
              <div className="control__radio">
                <input
                  id="nested_radio"
                  name="view"
                  type="radio"
                  value="nested"
                  onClick={handleViewChange}
                  checked={view === "nested"}
                />
                <label for="nested_radio">States + Counties</label>
              </div>
              <div className="control__radio">
                <input
                  id="states_radio"
                  name="view"
                  type="radio"
                  value="states"
                  onClick={handleViewChange}
                  checked={view === "states"}
                />
                <label for="states_radio">States</label>
              </div>
              <div className="control__radio">
                <input
                  id="counties_radio"
                  name="view"
                  type="radio"
                  value="counties"
                  onClick={handleViewChange}
                  checked={view === "counties"}
                />
                <label for="counties_radio">Counties</label>
              </div>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          data={tableData}
          className={`table--${view}`}
          view={view}
        />
      </TableContainer>
    </Block>
  );
}

export default FullTable;
