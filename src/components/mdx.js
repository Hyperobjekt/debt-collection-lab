import React from "react";
import { Button, Box } from "@material-ui/core";
import { Block, Container } from "@hyperobjekt/material-ui-website";
import Typography from "./typography";
import { Callout, CalloutBlock } from "./sections";
import { FullLawsuitTable } from "../lawsuit-tracker/table";
import mdxComponents from "gatsby-theme-hypersite/src/gatsby-theme-hypercore/mdx";
import Hero from "./sections/hero";

const components = {
  ...mdxComponents,
  section: Container,
  span: (props) => <Typography component="span" {...props} />,
  Hero,
  Block,
  Typography,
  Box,
  Callout,
  Button,
  FullLawsuitTable,
  CalloutBlock,
};

export default components;
