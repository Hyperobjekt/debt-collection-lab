import React from "react";
import {
  Page as BasePage,
  Header,
  Main,
  Footer as BaseFooter,
} from "@hyperobjekt/material-ui-website";
import Seo from "./seo";
import { Branding } from "@hyperobjekt/material-ui-website/lib/header";
import { Navigation } from "@hyperobjekt/material-ui-website/lib/navigation";
import { useSiteMetadata } from "../hooks/use-site-metadata";
import { styled, withStyles } from "@material-ui/core";
import Container from "./container";

const Page = withStyles((theme) => ({
  root: {
    position: "absolute",
    minHeight: "100%",
    width: "100%",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    background: theme.palette.background.default,
  },
}))(BasePage);

const HeaderContainer = styled(Container)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const DesktopNavigation = withStyles((theme) => ({
  list: {
    display: "flex",
    flexDirection: "row",
  },
  link: {
    color: theme.palette.primary.contrastText,
  },
}))(Navigation);

const Footer = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 0),
    background: theme.palette.grey[200],
  },
}))(BaseFooter);

const Layout = ({ children, seo = {}, ...props }) => {
  const siteMetadata = useSiteMetadata();
  return (
    <Page {...props}>
      <Seo {...seo} />
      {/* <SkipNavLink /> */}
      <Header sticky>
        <HeaderContainer>
          <Branding>Debt Collection Lab</Branding>
          <DesktopNavigation links={siteMetadata.menuLinks} />
        </HeaderContainer>
      </Header>
      <Main>
        {/* <SkipNavContent /> */}
        <Container>{children}</Container>
      </Main>
      <Footer>
        <Container>Footer</Container>
      </Footer>
    </Page>
  );
};

export default Layout;
