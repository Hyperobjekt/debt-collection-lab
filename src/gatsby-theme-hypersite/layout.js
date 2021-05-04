import React from "react";
import { default as BaseLayout } from "gatsby-theme-hypersite/src/layout";
import { Helmet } from "react-helmet";

const Layout = ({ children, ...props }) => {
  return (
    <BaseLayout {...props}>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cloud.typography.com/6135894/6115032/css/fonts.css"
        />
      </Helmet>
      {children}
    </BaseLayout>
  );
};

export default Layout;