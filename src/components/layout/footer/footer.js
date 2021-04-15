import React from "react";
import clsx from "clsx";
import {
  Footer as BaseFooter,
  Navigation,
} from "@hyperobjekt/material-ui-website";
import { Box, withStyles } from "@material-ui/core";
import Container from "../container";
import Typography from "../../typography";
import Logo from "../logo";
import { useSiteMetadata } from "../../../hooks/use-site-metadata";
import { Link } from "gatsby-material-ui-components";

const styles = (theme) => ({
  root: {
    flexDirection: "column",
    padding: theme.spacing(8, 0),
    background: theme.palette.grey[200],
  },
  row1: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
  },
  phrase: {
    maxWidth: 360,
    textAlign: "center",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
  },
  row2: {},
  copyright: {
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
  },
});

const Footer = ({ classes, className, children, pageContext, ...props }) => {
  const siteMetadata = useSiteMetadata();
  return (
    <BaseFooter className={clsx(classes.root, className)}>
      <Container className={classes.row1}>
        <Typography className={classes.phrase} variant="h4">
          It is important that we understand debt collection so that we can
          change it
        </Typography>
        <Box>
          <Logo />
          <Navigation LinkComponent={Link} links={siteMetadata.menuLinks} />
        </Box>
      </Container>
      <Container className={classes.row2}>
        <Typography className={classes.copyright}>
          {siteMetadata.title} © {new Date().getFullYear()} | Site by{" "}
          <Link href="https://hyperobjekt.com">Hyperobjekt</Link>
        </Typography>
      </Container>
    </BaseFooter>
  );
};

export default withStyles(styles)(Footer);
