import React from "react";
import Layout from "../components/layout";

export default function DefaultLayout({ children, ...props }) {
  return <Layout {...props}>{children}</Layout>;
}
