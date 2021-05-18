import React from "react";
import { SvgIcon } from "@material-ui/core";

const FlagIcon = (props) => {
  return (
    <SvgIcon aria-label="disproportionate" {...props}>
      <circle cx="12" cy="12" r="12" fill="#595247" />
      <rect x="6" y="9" width="12" height="2" fill="white" />
      <rect
        x="8.26953"
        y="16.7559"
        width="12"
        height="2"
        transform="rotate(-61.6593 8.26953 16.7559)"
        fill="white"
      />
      <rect x="6" y="13" width="12" height="2" fill="white" />
    </SvgIcon>
  );
};

export default FlagIcon;
