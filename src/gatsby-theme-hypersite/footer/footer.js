import React from "react";
import clsx from "clsx";
import {
  Footer as BaseFooter,
  Navigation,
  Container,
} from "@hyperobjekt/material-ui-website";
import { Box, withStyles, Divider } from "@material-ui/core";
import Typography from "../../components/typography";
import Logo from "gatsby-theme-hypersite/src/logo";
import { useSiteMetadata } from "gatsby-theme-hypercore";
import { GatsbyLink, Link } from "gatsby-material-ui-components";
import { FONTS } from "../../theme";

const styles = (theme) => ({
  root: {
    position: "relative",
    flexDirection: "column",
    padding: theme.spacing(8, 0, 11),
    background: theme.palette.background.footer,
    color: theme.palette.text.light,
    minHeight: 436,
    "& .MuiDivider-root": {
      width: 40,
      height: 4,
      background: "#fff",
      border: "none",
      margin: theme.spacing(2, 0, 1, 0),
    },
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
    maxWidth: "10em",
    textAlign: "center",
    marginBottom: theme.spacing(6),
    ...FONTS.KNOCKOUT["Lightweight"],
    fontSize: theme.typography.pxToRem(28),
    letterSpacing: "0.03em",
    lineHeight: 60 / 46,
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
      fontSize: theme.typography.pxToRem(32),
    },
    [theme.breakpoints.up("md")]: {
      fontSize: theme.typography.pxToRem(46),
    },
  },
  row2: {
    marginTop: "auto",
  },
  row3: {
    background: "#262625",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    "& a + a": {
      display: "block",
      marginLeft: theme.spacing(4),
    },
    "& img": {
      display: "block",
    },
  },
  copyright: {
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
    "& .MuiLink-root": {
      color: theme.palette.common.white,
      textDecoration: "underline",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  },
  navLink: {
    marginLeft: theme.spacing(-2),
    color: "#fff",
    textDecoration: "none",
    textAlign: "center",
    "&:hover, &:focus": {
      textDecoration: "underline",
    },
  },
  linkActive: {
    fontWeight: 700,
  },
  linksWrapper: {
    minWidth: 200,
    margin: theme.spacing(2, 0, 6, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      alignItems: "flex-start",
    },
  },
});

const Footer = ({ classes, className, children, pageContext, ...props }) => {
  const siteMetadata = useSiteMetadata();
  return (
    <BaseFooter className={clsx(classes.root, className)}>
      <Container className={classes.row1}>
        <Typography className={classes.phrase} component="p" variant="h4">
          We make visible the practices and indignities long shielded from the
          light.
        </Typography>
        <Box className={classes.linksWrapper}>
          <Logo />
          <Divider />
          <Navigation
            classes={{ link: classes.navLink, linkActive: classes.linkActive }}
            isGatsbyLink={true}
            LinkComponent={GatsbyLink}
            links={siteMetadata.menuLinks}
          />
        </Box>
      </Container>
      <Container className={classes.row2}>
        <Typography variant="caption" className={classes.copyright}>
          {siteMetadata.title} © {new Date().getFullYear()} | Site by{" "}
          <Link href="https://hyperobjekt.com">Hyperobjekt</Link>
        </Typography>
      </Container>
      <Box className={classes.row3} bgcolor="grey.800">
        <Container display="flex" flexDirection="row" pt={3} pb={3}>
          <a href="https://www.princeton.edu/" target="_blank" rel="noreferrer">
            <img
              width="72"
              src="/images/princeton-logo.svg"
              alt="Princeton University Logo"
            />
          </a>
          <a
            href="https://www.dignityanddebt.org/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              width="93"
              src="/images/d-d-logo.svg"
              alt="Dignity and Debt Logo"
            />
          </a>
          <a
            href="https://anthropology.princeton.edu/research-programs/vize-lab"
            target="_blank"
            rel="noreferrer"
          >
            <img width="53" src="/images/viz-e-lab.svg" alt="VizE Lab Logo" />
          </a>
          <a href="https://www.ssrc.org/" target="_blank" rel="noreferrer">
            <img width="56" src="/images/ssrc-logo.svg" alt="SSRC Logo" />
          </a>
        </Container>
      </Box>
    </BaseFooter>
  );
};

export default withStyles(styles)(Footer);
