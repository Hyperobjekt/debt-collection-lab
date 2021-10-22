import {
  TableContainer as MuiTableContainer,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  withStyles,
  darken,
  Box,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { GatsbyLink, Link } from "gatsby-material-ui-components";
import React from "react";
import { useTable, useExpanded } from "react-table";
import Typography from "../../components/typography";
import { getTrackerUrl } from "../utils";

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
        position: 'sticky',
        left: 0,
        background: 'white',
        paddingLeft: theme.spacing(2),
        zIndex: 1,
        '&.MuiTableCell-head': {
          zIndex: 11,
        }
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
    },
    // indent nested rows
    "& .MuiTableRow-root.row--1 .MuiTableCell-root:first-child": {
      paddingLeft: theme.spacing(3),
    },
    // align trend line
    "& .MuiTableCell-root.col--trend svg": {
      marginTop: 4,
    },
    // size text for jump to map button
    "& .MuiTableCell-root.col--jump > a": {
      fontSize: theme.typography.pxToRem(12),
      textAlign: 'center',
      lineHeight: 1,
      "&:hover":{
        textDecoration: 'underline'
      },
    },
    // size text for jump to map button
    "& .MuiTableCell-root.col--view > a": {
      background: '#FEF7F6',
      borderStyle: 'solid',
      borderColor: '#CA432B',
      borderWidth: 1,
      fontSize: theme.typography.pxToRem(14),
      "&:hover":{
        backgroundColor: darken('#FEF7F6', 0.05),
        textDecoration: 'underline'
      },
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

  const [isScrolled, setScrolled] = React.useState(false)
  const [showMore, setShowMore] = React.useState(true)

  const tableRef = React.useRef(null)

  const isFullyScrolled = (e) => {
    let element = e.target
    if (element.scrollLeft + element.offsetWidth > element.scrollWidth - 50) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  const useWindowSize = () => {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = React.useState({
      width: undefined,
      height: undefined,
    });
    React.useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

  const theme = useTheme();
  const isBig = useMediaQuery(theme.breakpoints.up('md'));
  //only showMore when table is overflowing
  const size = useWindowSize()
  React.useEffect(()=>{
    if(tableRef){
      if(tableRef.current.scrollWidth === tableRef.current.clientWidth || isBig){
        setShowMore(false)
      } else {
        setShowMore(true)
      }
    }
  }, [size.width, tableRef])

  return (
    <>
      <TableContainer ref={tableRef} onScroll={(e) => isFullyScrolled(e)}>
        <MuiTable id="table" className={className} {...getTableProps()}>
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
      {showMore &&
        <Box className={isScrolled ? 'fade hide' : 'fade'}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0C9.3144 0 12 2.6862 12 6C12 9.3138 9.3144 12 6 12C2.6868 12 0 9.3138 0 6C0 2.6862 2.6868 0 6 0ZM6.4686 3.2814L6.4182 3.2376C6.34169 3.18095 6.24918 3.15002 6.15398 3.14927C6.05878 3.14851 5.9658 3.17797 5.8884 3.2334L5.832 3.2814L5.7888 3.3318C5.73215 3.40831 5.70122 3.50082 5.70047 3.59602C5.69971 3.69122 5.72917 3.7842 5.7846 3.8616L5.8326 3.918L7.464 5.55H3.45L3.3888 5.5536C3.29142 5.56699 3.20111 5.6119 3.13165 5.68146C3.0622 5.75101 3.01744 5.8414 3.0042 5.9388L3 5.9994L3.0042 6.0606C3.01756 6.15789 3.06238 6.24814 3.13182 6.31758C3.20126 6.38702 3.29151 6.43184 3.3888 6.4452L3.45 6.4494H7.464L5.832 8.0814L5.7882 8.1324C5.72321 8.21906 5.69165 8.32625 5.69933 8.4343C5.70701 8.54235 5.75341 8.644 5.83 8.7206C5.9066 8.79719 6.00825 8.84359 6.1163 8.85127C6.22435 8.85895 6.33154 8.82739 6.4182 8.7624L6.468 8.7186L8.8692 6.3186L8.9124 6.2676C8.969 6.19121 8.99996 6.09885 9.00082 6.00378C9.00168 5.90871 8.97241 5.81581 8.9172 5.7384L8.8692 5.682L6.4692 3.2814L6.4182 3.2376L6.4686 3.2814Z" fill="#595247"/>
          </svg>
          Scroll for more
        </Box>
      }
    </>
  );
}
