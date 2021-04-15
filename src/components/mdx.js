import React from "react";
import {
  Button,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import Container from "./layout/container";
import Typography from "./typography";
import { Hero, Block, Callout } from "./sections";
import ResponsiveBox from "./layout/responsive-box";
import { FullLawsuitTable } from "../lawsuit-tracker/table";
const headingStyles = {
  root: {
    // marginTop: "1.5em",
  },
};

export const H1 = withStyles(headingStyles)(({ children, ...props }) => (
  <Typography gutterBottom variant="h1" {...props}>
    {children}
  </Typography>
));
export const H2 = withStyles(headingStyles)(({ children, ...props }) => (
  <Typography gutterBottom variant="h2" {...props}>
    {children}
  </Typography>
));
export const H3 = withStyles(headingStyles)(({ children, ...props }) => (
  <Typography gutterBottom variant="h3" {...props}>
    {children}
  </Typography>
));
export const H4 = withStyles(headingStyles)(({ children, ...props }) => (
  <Typography gutterBottom variant="h4" {...props}>
    {children}
  </Typography>
));
export const H5 = withStyles(headingStyles)(({ children, ...props }) => (
  <Typography gutterBottom variant="h5" {...props}>
    {children}
  </Typography>
));
export const H6 = withStyles(headingStyles)(({ children, ...props }) => (
  <Typography gutterBottom variant="h6" {...props}>
    {children}
  </Typography>
));
export const Paragraph = ({ children, ...props }) => (
  <Typography gutterBottom variant="body1" paragraph={true} {...props}>
    {children}
  </Typography>
);

export const BulletList = withStyles(
  (theme) => ({
    root: {
      listStyleType: "disc",
      paddingLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
      "& > li": {
        display: "list-item",
      },
    },
  }),
  { name: "HypBulletList" }
)(List);

export const OrderedList = withStyles(
  (theme) => ({
    root: {
      listStyleType: "decimal",
      paddingLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
      "& > li": {
        display: "list-item",
      },
    },
  }),
  { name: "HypOrderedList" }
)(List);

export const CodeInline = styled("code")({
  background: "#eee",
  padding: 8,
  borderRadius: 4,
});

const components = {
  section: Container,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: Paragraph,
  ul: BulletList,
  li: ListItem,
  ol: (props) => <OrderedList component="ol" {...props} />,
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  td: TableCell,
  th: TableCell,
  button: Button,
  a: Link,
  code: CodeInline,
  Hero,
  Block,
  Typography,
  Box: ResponsiveBox,
  Callout,
  Button,
  FullLawsuitTable,
};

export default components;
