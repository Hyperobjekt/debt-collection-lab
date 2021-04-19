import React from "react";
import Layout from "../../components/layout";

export default function DefaultLayout({ children, ...props }) {
  return (
    <Layout {...props}>
      {children}
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Layout>
  );
}
