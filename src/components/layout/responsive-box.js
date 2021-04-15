import React from "react";
import {
  compose,
  spacing,
  palette,
  breakpoints,
  flexbox,
  display,
  sizing,
  typography,
} from "@material-ui/system";
import styled from "styled-components";

const Box = styled.div`
  ${breakpoints(
    compose(flexbox, typography, spacing, palette, display, sizing)
  )}
`;

const ResponsiveBox = (props) => {
  return <Box {...props} />;
};

export default ResponsiveBox;
