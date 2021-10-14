import React from "react";
import Layout from "../../../gatsby-theme-hypersite/layout";
import { graphql } from "gatsby";
import * as d3 from "d3";
import IndexHero from "./hero";
import IndexAbout from "./about";
import { getDateRange, getTotals } from "../../utils";
import { getImage } from "gatsby-plugin-image";
import { TableSection } from "../../sections";
import { TwoColBlock } from "../../../components/sections";
import { Box } from "@material-ui/core";
import Typography from "../../../components/typography";

const intFormat = d3.format(",d");
const monthFormat = d3.timeFormat("%B %Y");

// TODO: make an MDX file for this page so metadata can be set via CMS instead of set in gatsby-node

export default function TrackerIndexLayout({ children, ...props }) {
  const data = props.data.allStates.nodes;
  const { stateCount, countyCount, lawsuitTotal } = getTotals(data);
  const dateRange = getDateRange(data);
  const content = props.data.lawsuitTrackerJson;
  const image = getImage(props.data.allFile.nodes[0]);
  return (
    <Layout meta={props.pageContext.frontmatter.meta} {...props}>
      <IndexHero
        stateCount={stateCount}
        countyCount={countyCount}
        lawsuitTotal={intFormat(lawsuitTotal)}
        startDate={monthFormat(dateRange[0])}
        endDate={monthFormat(dateRange[1])}
        content={content.index.hero}
        image={image}
      />
      <IndexAbout content={content.index.about} />
      <TableSection
        views={["nested", "states", "counties"]}
        data={data}
        content={{ ...content.index.table, ...content.table }}
      />
      {/* TODO: refactor additional info so it can be MDX instead of raw html */}
      <TwoColBlock
        bgcolor="background.alt"
        left={
          <Typography variant="sectionTitle" component="h2">
            {content.index.additional.TITLE}
          </Typography>
        }
        right={
          <Box
            style={{ fontSize: 16 }}
            mt={2}
            dangerouslySetInnerHTML={{
              __html: content.index.additional.DESCRIPTION,
            }}
          />
        }
      />

      {children}
    </Layout>
  );
}

export const query = graphql`
  {
    allFile(filter: { name: { eq: "tracker-hero" } }) {
      nodes {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
    }
    allStates {
      nodes {
        geoid
        name
        lawsuits
        completed_lawsuits
        lawsuits_date
        no_rep_percent
        default_judgement
        lawsuit_history {
          lawsuits
          month
        }
        counties {
          default_judgement
          geoid
          state
          lawsuits
          disproportionate
          lawsuit_history {
            lawsuits
            month
          }
          lawsuits_date
          name
          no_rep_percent
        }
      }
    }
    lawsuitTrackerJson {
      county {
        collectors {
          DESCRIPTION
          FOOTNOTE
          TITLE
        }
        demographics {
          BREAKDOWN_LABEL
          BREAKDOWN_TITLE
          COUNT_CHART_TITLE
          COUNT_CHART_TOOLTIP
          DESCRIPTION
          FOOTNOTE
          PROPORTION_CHART_TITLE
          PROPORTION_CHART_TOOLTIP
          TITLE
        }
        hero {
          STATS {
            description
            id
          }
        }
        lawsuits {
          DESCRIPTION
          FOOTNOTE
          PANDEMIC_COMPARISON
          TITLE
        }
        map {
          TITLE
          LABEL
          FOOTNOTE
          DESCRIPTION
        }
        table {
          DESCRIPTION
          FOOTNOTE
          TITLE
        }
      }
      state {
        table {
          TITLE
          FOOTNOTE
          DESCRIPTION
        }
        map {
          DESCRIPTION
          FOOTNOTE
          LABEL
          TITLE
        }
        lawsuits {
          DESCRIPTION
          FOOTNOTE
          PANDEMIC_COMPARISON
          TITLE
        }
        hero {
          STATS {
            description
            id
          }
        }
        demographics {
          BREAKDOWN_LABEL
          BREAKDOWN_TITLE
          COUNT_CHART_TITLE
          COUNT_CHART_TOOLTIP
          DESCRIPTION
          FOOTNOTE
          PROPORTION_CHART_TITLE
          PROPORTION_CHART_TOOLTIP
          TITLE
        }
        collectors {
          DESCRIPTION
          FOOTNOTE
          TITLE
        }
      }
      table {
        ZIPS_NOTE
        TOP_LIMIT
        STATES_NOTE
        TEXAS_NOTE
        REPORT_LINK
        NO_RESULTS
        NORTH_DAKOTA_NOTE
        LAST_UPDATED
        DEFAULT_JUDGEMENTS_HINT
        COUNTIES_NOTE
      }
      index {
        about {
          DESCRIPTION
          LINKS {
            link
            name
          }
          TITLE
        }
        hero {
          SECOND_LINE
          FIRST_LINE
        }
        table {
          DESCRIPTION
          TITLE
        }
        additional {
          DESCRIPTION
          TITLE
        }
      }
    }
  }
`;
