import React from "react";
import { Header as BaseHeader } from "@hyperobjekt/material-ui-website";
import { useSiteMetadata } from "../../../hooks/use-site-metadata";
import { styled, withStyles } from "@material-ui/core";
import Container from "../container";
import DesktopNavigation from "./desktop-navigation";
import MobileNavigation from "./mobile-navigation";
import Logo from "../logo";

const StyledHeader = withStyles((theme) => ({
  root: {
    background: theme.palette.primary.main,
    boxShadow: "none",
  },
}))(BaseHeader);

const ContentContainer = styled(Container)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

const Header = (props) => {
  const siteMetadata = useSiteMetadata();
  return (
    <StyledHeader sticky stickyOffset={0} {...props}>
      <ContentContainer>
        <Logo />
        <DesktopNavigation links={siteMetadata.menuLinks} />
        <MobileNavigation links={siteMetadata.menuLinks} />
      </ContentContainer>
    </StyledHeader>
  );
};

export default Header;
