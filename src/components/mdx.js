import { Button } from "@material-ui/core";
import { Hero, Block, Container } from "@hyperobjekt/material-ui-website";
import Typography from "./typography";
import { Callout } from "./sections";
import { FullLawsuitTable } from "../lawsuit-tracker/table";
import mdxComponents from "gatsby-theme-hypersite/src/gatsby-theme-hypercore/mdx";
import {
  compose,
  spacing,
  palette,
  breakpoints,
  flexbox,
  display,
  sizing,
  typography,
} from "@material-ui/system";
import styled from "styled-components";

const ResponsiveBox = styled.div`
  ${breakpoints(
    compose(flexbox, typography, spacing, palette, display, sizing)
  )}
`;

const components = {
  ...mdxComponents,
  section: Container,
  Hero,
  Block,
  Typography,
  Box: ResponsiveBox,
  Callout,
  Button,
  FullLawsuitTable,
};

export default components;
