import { styled } from "@material-ui/core";
import React from "react";
import ResponsiveBox from "./responsive-box";

const Box = styled(ResponsiveBox)({
  margin: `auto`,
  width: `100%`,
  flexDirection: "column",
  position: "relative",
  boxShadow: `inset 0 0 0 1px rgba(255,0,0,0.2)`,
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    minHeight: "100%",
    zIndex: 3000000,
    opacity: 0.33,
    backgroundSize: `1rem 1rem`,
    backgroundPosition: `0px 0px`,
    pointerEvents: `none`,
    // mixBlendMode: `difference`,
    // mix-blend-mode: multiply;
    backgroundImage: `linear-gradient( transparent 0%, transparent 93.749%, cyan 93.75%, cyan 100%), linear-gradient( 90deg, transparent 0%, transparent 93.749%, cyan 93.75%, cyan 100%)`,
  },
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
