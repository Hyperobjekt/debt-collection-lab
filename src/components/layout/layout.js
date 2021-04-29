import React from "react";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
import "@reach/skip-nav/styles.css"; //this will auto show and hide the link on focus
import * as _pick from "lodash.pick";

import { Page as BasePage, Main } from "@hyperobjekt/material-ui-website";
import Header from "./header";
import Footer from "./footer";

import Seo from "../seo";
import { withStyles } from "@material-ui/core";
import { SEO_KEYS } from "../../constants";
import { Helmet } from "react-helmet";

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

const Layout = ({ children, pageContext, ...props }) => {
  const { frontmatter } = pageContext;
  const seo = _pick(frontmatter, SEO_KEYS);
  return (
    <Page>
      <Seo {...seo} />
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cloud.typography.com/6135894/6115032/css/fonts.css"
        />
      </Helmet>
      <SkipNavLink />
      <Header />
      <Main>
        <SkipNavContent />
        {children}
      </Main>
      <Footer />
    </Page>
  );
};

export default Layout;
