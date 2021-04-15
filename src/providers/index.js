import React from "react";
import components from "../components/mdx";
import { MDXProvider } from "@mdx-js/react";

export default function Providers({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
