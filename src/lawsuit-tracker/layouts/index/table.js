import React from "react";
import Typography from "../../../components/typography";
import { TableSection } from "../../sections";
import Mustache from "mustache";

function IndexTable({
  data,
  trendRange,
  stateCount,
  countyCount,
  lastUpdated,
  content,
}) {
  const context = { trendRange, stateCount, countyCount, lastUpdated };
  const description = (
    <>
      <Typography paragraph>
        {Mustache.render(content.DESCRIPTION, context)}
      </Typography>
      <Typography variant="caption">
        {Mustache.render(content.LAST_UPDATED, context)}
      </Typography>
    </>
  );
  return (
    <TableSection
      title={Mustache.render(content.TITLE, context)}
      description={description}
      views={["nested", "states", "counties"]}
      data={data}
      content={content}
    />
  );
}

export default IndexTable;
