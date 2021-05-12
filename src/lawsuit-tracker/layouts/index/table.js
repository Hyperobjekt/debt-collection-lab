import React from "react";
import { TableSection } from "../../sections";

function IndexTable({ data, content }) {
  return (
    <TableSection
      views={["nested", "states", "counties"]}
      data={data}
      content={content}
    />
  );
}

export default IndexTable;
