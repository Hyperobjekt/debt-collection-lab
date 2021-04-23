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
        <Grid key={l[0]} className="legend__item" justify="center" item xs>
          <div
            className={`legend__color legend__color--${i}`}
            style={{ background: l[1] }}
          />
          <Typography className="legend__label">{l[0]}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

ChartLegend.propTypes = {};

export default ChartLegend;
