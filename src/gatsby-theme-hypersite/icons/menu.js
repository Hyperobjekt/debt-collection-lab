import React from "react";
import { SvgIcon, Typography, withStyles } from "@material-ui/core";

const MenuTypography = withStyles((theme) => ({
  root: {
    fontSize: theme.typography.pxToRem(14),
    letterSpacing: 1,
  },
}))(Typography);

const MenuIcon = (props) => {
  return (
    <>
      <SvgIcon aria-hidden="true" {...props}>
        <path d="M5 9H19V10H5V9Z" />
        <path d="M5 9H19V10H5V9Z" />
        <path d="M9 13H19V14H9V13Z" />
        <path d="M9 13H19V14H9V13Z" />
      </SvgIcon>
      <MenuTypography>Menu</MenuTypography>
    </>
  );
};

export default MenuIcon;
