import React from "react";
import { default as BaseLayout } from "gatsby-theme-hypersite/src/layout";
import { Helmet } from "react-helmet";
import "@reach/skip-nav/styles.css";
import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      // add padding to make room for header on
      // first element of the page content
      "#reach-skip-nav + *": {
        paddingTop: theme.spacing(16),
      },
    },
  })
);

const Layout = ({ children, ...props }) => {
  useStyles();
  return (
    <BaseLayout {...props}>
      <Helmet
        htmlAttributes={{
          lang: props.frontmatter?.lang || "en",
        }}
      >
        <link
          rel="stylesheet"
          href="https://cloud.typography.com/6135894/6115032/css/fonts.css"
          media="print"
          onload="this.media='all'"
        />
      </Helmet>
      {children}
    </BaseLayout>
  );
};

export default Layout;
