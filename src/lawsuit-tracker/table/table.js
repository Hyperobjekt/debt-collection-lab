import {
  TableContainer as MuiTableContainer,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  withStyles,
  darken,
} from "@material-ui/core";
import { GatsbyLink, Link } from "gatsby-material-ui-components";
import React from "react";
import { useTable, useExpanded } from "react-table";
import Typography from "../../components/typography";
import { getTrackerUrl } from "../utils";
import { navigate } from "gatsby";

/**
 * Returns if an additional row with additional content should be added
 * based on the view, current row, next row, and parent row.
 * @param {*} view
 * @param {*} currentRow
 * @param {*} prevParentRow
 * @param {*} nextRow
 * @returns
 */
const getAdditionalRowContent = (
  view,
  currentRow,
  prevParentRow,
  nextRow,
  content
) => {
  const isNested = view === "nested";
  const isNextTopLevel = !nextRow || nextRow.depth === 0; // next row is top level or end of table
  const isParentTexas = prevParentRow?.name === "Texas";
  const isNorthDakota = currentRow.original.name === "North Dakota";
  const pastLimitThreshold = prevParentRow?.subRows?.length > 5;
  // show note after Harris county
  if (isNested && isNextTopLevel && isParentTexas) {
    const parts = content["TEXAS_NOTE"].split("{{page}}");
    return (
      <Typography variant="caption">
        {parts[0]}
        {parts.length > 1 && (
          <Link
            component={GatsbyLink}
            to={getTrackerUrl({ name: "Harris County", state: "Texas" })}
          >
            Harris county report
          </Link>
        )}
        {parts[1]}
      </Typography>
    );
  }
  if (isNested && isNextTopLevel && isNorthDakota) {
    const parts = content["NORTH_DAKOTA_NOTE"].split("{{page}}");
    return (
      <Typography variant="caption">
        {parts[0]}
        <Link
          component={GatsbyLink}
          to={getTrackerUrl({ name: "North Dakota" })}
        >
          state report
        </Link>{" "}
        {parts[1]}
      </Typography>
    );
  }
  if (isNested && isNextTopLevel && pastLimitThreshold) {
    const parts = content["TOP_LIMIT"].split("{{page}}");
    return (
      <Typography variant="caption">
        {parts[0]}
        <Link component={GatsbyLink} to={getTrackerUrl(prevParentRow)}>
          {prevParentRow.name} report
        </Link>{" "}
        {parts[1]}
      </Typography>
    );
  }
  return null;
};

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
    "& .MuiTableCell-root.MuiTableCell-head": {
      lineHeight: 1.25,
      "& .MuiTableSortLabel-root:focus, & .MuiTableSortLabel-root:hover": {
        textDecoration: "underline",
      },
      // add dotted underline for tooltip indicator
      "& .MuiTableSortLabel-root span": {
        textDecoration: "underline dotted #999 2px",
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
      background: theme.palette.background.alt,
      "& .MuiTableCell-root": {
        fontWeight: 500,
        height: 56,
        fontSize: theme.typography.pxToRem(16),
      },
      "&:hover": {
        backgroundColor: darken(theme.palette.background.alt, 0.05),
      },
    },
    // row hover states
    "& .MuiTableRow-root.row--1, .MuiTableRow-root.row--0": {
      transition: theme.transitions.create(["background-color"], {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
        cursor: "pointer",
        "& .MuiButton-text": {
          textDecoration: "underline",
        },
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

/**
 * Component that renders the actual table, based on columns, data,
 * and the current view
 */
export default function Table({
  columns: userColumns,
  data,
  className,
  view,
  content,
}) {
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

  /** get the note (if any) to append to the table */
  const noteKey = view.toUpperCase() + "_NOTE";
  const note = content.hasOwnProperty(noteKey) ? content[noteKey] : null;

  /** limit rows for nested view, so only 5 rows appear below parent */
  let subRowCount = 0;
  const truncatedRows = rows.filter((r) => {
    if (r.depth === 0) {
      subRowCount = 0;
    }
    if (r.depth > 0 && subRowCount >= 5) return false;
    if (r.depth > 0) subRowCount++;
    return true;
  });

  /** used to track the parent row when rendering the table */
  let prevParentRow = null;

  const handleRowClick = (row) => {
    // do nothing when a tract / zip row is clicked
    if (
      row.original.geoid.length > 5 ||
      row.original.name.indexOf("Zip") > -1 ||
      row.original.name === "Texas"
    )
      return;
    navigate(getTrackerUrl(row.original));
  };

  return (
    <TableContainer>
      <MuiTable className={className} {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, i) => (
            <TableRow key={"header" + i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <TableCell
                  key={"col" + j}
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
            // boolean to indicate if an additional row should be tacked on
            let showMore = getAdditionalRowContent(
              view,
              row,
              prevParentRow,
              nextRow,
              content
            );
            // if top level row, set prev parent
            if (row.depth === 0) prevParentRow = row.original;
            return (
              <React.Fragment key={"row" + i}>
                <TableRow
                  className={`row row--${row.depth}`}
                  {...row.getRowProps()}
                  onClick={() => handleRowClick(row)}
                >
                  {row.cells.map((cell, j) => {
                    return (
                      <TableCell
                        key={"cell" + j}
                        {...cell.getCellProps()}
                        {...(cell.column.cellProps || {})}
                      >
                        {cell.value !== "0" ? cell.render("Cell") : "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {showMore && (
                  <TableRow className="row--more">
                    <TableCell align="center" colSpan="5">
                      {showMore}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
          {note && (
            <TableRow className="row--more">
              <TableCell align="center" colSpan="5">
                <Typography variant="caption">{note}</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
