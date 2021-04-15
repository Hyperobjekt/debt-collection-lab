import React from "react";
import { useTable, useExpanded } from "react-table";

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

  let prevRowDepth = 0;
  let prevParentRow = null;

  return (
    <>
      <table className={className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
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
                <>
                  Top 5 counties shown above, go to the{" "}
                  <a href="#">{prevParentRow.name} report</a> to see all
                  counties.
                </>
              );
              if (prevParentRow && prevParentRow.name === "Texas") {
                showMoreText = (
                  <>
                    State level data is unavailable for Texas, only the{" "}
                    <a href="#">Harris county report</a> is available.
                  </>
                );
              }
            }
            prevRowDepth = row.depth;
            if (row.depth === 0) prevParentRow = row.original;
            return (
              <>
                <tr className={`row row--${row.depth}`} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                {showMore && (
                  <tr className="row--more">
                    <td colSpan="5">{showMoreText}</td>
                  </tr>
                )}
              </>
            );
          })}
          {view === "counties" && (
            <tr className="row--more">
              <td colSpan="5">The top 25 counties are listed above </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
