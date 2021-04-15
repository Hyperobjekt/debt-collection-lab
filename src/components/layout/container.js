import { styled } from "@material-ui/core";
import React from "react";
import ResponsiveBox from "./responsive-box";

const Box = styled(ResponsiveBox)({
  margin: `auto`,
  width: `100%`,
  flexDirection: "column",
});

/**
 * Wrapper for page content
 */
const Container = ({ xs, sm, md, lg, xl, ...props }) => {
  return (
    <Box
      xs={{ pl: 2, pr: 2, ...xs }}
      sm={{ pl: 3, pr: 3, ...sm }}
      md={{ pl: 6, pr: 6, ...md }}
      lg={{ maxWidth: 1280, ...lg }}
      xl={{ maxWidth: 1440, ...xl }}
      {...props}
    />
  );
};

Container.defaultProps = {
  xs: {},
  sm: {},
  md: {},
  lg: {},
  xl: {},
};

Container.propTypes = {};

export default Container;
