import React from "react";
import clsx from "clsx";
import { Typography, Box } from "@material-ui/core";

const ChartLegend = ({ labels, className, ...props }) => {
  return (
    <Box
      className={clsx("legend", className)}
      display="flex"
      alignItems="center"
      justify="space-around"
      {...props}
    >
      {labels.map((l, i) => (
        <Box key={l[0]} className="legend__item" display="flex">
          <div
            className={`legend__color legend__color--${i}`}
            style={{ background: l[1] }}
          />
          <Typography noWrap className="legend__label">
            {l[0]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

ChartLegend.propTypes = {};

export default ChartLegend;
