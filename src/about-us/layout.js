import React from "react";
import { graphql } from "gatsby";
import PageTemplate from "gatsby-theme-hypercore/src/templates/page";
import { createStyles, makeStyles } from "@material-ui/core";
import theme, { FONTS } from "../theme";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      ".hero--about": {
        paddingBottom: theme.spacing(21),
        [theme.breakpoints.up("lg")]: {
          paddingBottom: theme.spacing(24),
        },
      },
      ".hero__text, .hero__text > span": {
        ...FONTS.KNOCKOUT.FullMiddleweight,
        fontSize: theme.typography.pxToRem(36),
        lineHeight: 70 / 60,
        letterSpacing: "0.02em",
        maxWidth: `13em`,
        [theme.breakpoints.up("sm")]: {
          fontSize: theme.typography.pxToRem(48),
        },
        [theme.breakpoints.up("md")]: {
          fontSize: theme.typography.pxToRem(60),
        },
      },
      ".hero__text > span": {
        color: theme.palette.primary.main,
        position: "relative",
        whiteSpace: "nowrap",
        "&:after": {
          content: "''",
          position: "absolute",
          bottom: `-0.5em`,
          left: 0,
          width: `4em`,
          height: `0.5em`,
          backgroundImage: `url(/images/underline.svg)`,
          backgroundSize: `4em 11px`,
          backgroundRepeat: `no-repeat`,
        },
      },
      ".block": {
        backgroundColor: theme.palette.background.paper
      },
      ".list--team": {
        margin: 0,
        padding: 0,
        listStyle: "none",
      },
      ".list--secondary-team": {
        margin: 0,
        padding: 0,
        listStyle: "none",
        marginTop: 70,
      },
      ".image--about": {
        maxWidth: 460,
        marginTop: theme.spacing(-21),
        marginBottom: theme.spacing(6),
      },
      ".expand": {
        position: "absolute",
        bottom: 0,
        right: 0
      },
      ".title": {
        marginBottom: 5,
      },
      ".secondary-team":{
        marginTop: 20,
      },
    },
  })
);

export default function AboutTemplate(props) {
  useStyles();
  return <PageTemplate {...props} />;
}

export const pageQuery = graphql`
  query AboutQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        meta {
          title
          description
          keywords
          image {
            childImageSharp {
              gatsbyImageData(
                transformOptions: { fit: COVER, cropFocus: CENTER }
                width: 1200
                height: 630
              )
            }
          }
          isBlogPost
        }
        embeddedImages {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
        primaryTeam {
          title
          creds
          bio
          headshot {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH)
            }
          }
          headshot_thumbnail {
            childImageSharp {
              gatsbyImageData(width: 100)
            }
          }
        }
        secondaryTeam {
          title
          creds
        }
      }
    }
  }
`;
