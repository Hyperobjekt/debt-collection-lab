import React from "react";
import { Container as MuiContainer } from "@material-ui/core";
import PropTypes from "prop-types";

const Container = (props) => {
  return <MuiContainer maxWidth="md" {...props} />;
};

Container.propTypes = {};

export default Container;
