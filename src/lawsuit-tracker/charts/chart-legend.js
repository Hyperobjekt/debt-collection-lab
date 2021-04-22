import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Typography, Grid } from "@material-ui/core";

const ChartLegend = ({ labels, className, ...props }) => {
  return (
    <Grid
      className={clsx("legend", className)}
      container
      alignItems="center"
      justify="space-around"
      {...props}
    >
      {labels.map((l, i) => (
        <Grid key={l} className="legend__item" justify="center" item xs>
          <div className={`legend__color legend__color--${i}`} />
          <Typography className="legend__label">{l}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

ChartLegend.propTypes = {};

export default ChartLegend;
