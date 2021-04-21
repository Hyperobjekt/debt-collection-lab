import {
  TableContainer as MuiTableContainer,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  withStyles,
} from "@material-ui/core";
import { Link } from "gatsby-material-ui-components";
import React from "react";
import { useTable, useExpanded } from "react-table";
import Typography from "../../components/typography";
import { getTrackerUrl } from "../utils";

const TableContainer = withStyles((theme) => ({
  root: {
    position: "relative",
    // sticky headers
    [theme.breakpoints.up("md")]: {
      overflowX: "visible",
      "& th": {
        position: "sticky",
        top: 64,
        zIndex: 10,
        background: "#fff",
        boxShadow: `0 1px 0 #ccc`,
      },
    },
    // decrease default padding
    "& .MuiTableCell-root": {
      padding: theme.spacing(1),
      "&:first-child": {
        paddingLeft: theme.spacing(2),
      },
      "&:last-child": {
        paddingRight: theme.spacing(0),
      },
    },
    // highlight state rows in nested table
    "& .table--nested .MuiTableRow-root.row--0": {
      background: "#eee",
      "& .MuiTableCell-root": {
        fontWeight: 500,
        fontSize: theme.typography.pxToRem(16),
      },
    },
    // row hover states
    "& .MuiTableRow-root": {
      transition: theme.transitions.create(["background-color"], {
        duration: theme.transitions.duration.short,
      }),
      backgroundColor: "rgba(0,0,0,0)",
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.025)",
      },
    },
    // indent nested rows
    "& .MuiTableRow-root.row--1 .MuiTableCell-root:first-child": {
      paddingLeft: theme.spacing(3),
    },
    // align trend line
    "& .MuiTableCell-root.col--trend svg": {
      marginTop: 4,
    },
  },
}))(MuiTableContainer);

export default function Table({ columns: userColumns, data, className, view }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded // Use the useExpanded plugin hook
  );

  let subRowCount = 0;
  const truncatedRows = rows.filter((r) => {
    if (r.depth === 0) {
      subRowCount = 0;
    }
    if (r.depth > 0 && subRowCount >= 5) return false;
    if (r.depth > 0) subRowCount++;
    return true;
  });

  let prevParentRow = null;

  return (
    <TableContainer>
      <MuiTable className={className} {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps()}
                  {...(column.cellProps || {})}
                >
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {truncatedRows.map((row, i) => {
            prepareRow(row);
            let nextRow =
              i < truncatedRows.length ? truncatedRows[i + 1] : null;
            let showMore =
              (!nextRow || nextRow.depth === 0) &&
              view === "nested" &&
              prevParentRow &&
              ((prevParentRow.subRows && prevParentRow.subRows.length > 5) ||
                prevParentRow.name === "Texas");
            let showMoreText = "";
            if (showMore) {
              showMoreText = (
                <Typography variant="caption">
                  Top 5 counties shown above, go to the{" "}
                  <Link to={getTrackerUrl(prevParentRow)}>
                    {prevParentRow.name} report
                  </Link>{" "}
                  to see all counties.
                </Typography>
              );
              if (prevParentRow && prevParentRow.name === "Texas") {
                showMoreText = (
                  <Typography variant="caption">
                    State level data is unavailable for Texas, only the{" "}
                    <Link to="/counties/harris-county">
                      Harris county report
                    </Link>{" "}
                    is available.
                  </Typography>
                );
              }
            }
            if (row.depth === 0) prevParentRow = row.original;
            return (
              <>
                <TableRow
                  className={`row row--${row.depth}`}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => {
                    console.log("cell!", cell, cell.getCellProps());
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        {...(cell.column.cellProps || {})}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {showMore && (
                  <TableRow className="row--more">
                    <TableCell align="center" colSpan="5">
                      {showMoreText}
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
          {view === "counties" && (
            <TableRow className="row--more">
              <TableCell colSpan="5">
                The top 25 counties are listed above{" "}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
