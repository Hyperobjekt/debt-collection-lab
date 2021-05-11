import React from "react";
import { SvgIcon } from "@material-ui/core";

const HomeIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M7 11L11.5 8L16 11V17H7V11Z" transform="translate(0 -1)" />
    </SvgIcon>
  );
};

export default HomeIcon;
