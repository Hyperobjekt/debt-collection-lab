import React from "react";
import { graphql } from "gatsby";
import SubpageLayout from "../subpage";

export default function TrackerCountyLayout({
  children,
  pageContext,
  ...props
}) {
  const data = props.data.allCounties.nodes[0];
  const geojson = props.data.allGeojsonJson.nodes[0];
  const content = props.data.allLawsuitTrackerJson.nodes[0];
  const meta = pageContext.frontmatter.meta;
  const image = props.data.allFile.nodes[0];
  return (
    <SubpageLayout type="county" {...{ meta, data, geojson, image, content }} />
  );
}

export const query = graphql`
  query($geoid: String!, $state: String!) {
    allFile(filter: { name: { eq: "location-hero" } }) {
      nodes {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 350)
        }
      }
    }
    allLawsuitTrackerJson {
      nodes {
        county {
          hero {
            STATS {
              id
              description
            }
          }
          collectors {
            TITLE
            DESCRIPTION
            FOOTNOTE
          }
          lawsuits {
            TITLE
            DESCRIPTION
            PANDEMIC_COMPARISON
            FOOTNOTE
          }
          map {
            TITLE
            DESCRIPTION
            LABEL
            FOOTNOTE
          }
          table {
            TITLE
            DESCRIPTION
            FOOTNOTE
          }
          demographics {
            TITLE
            DESCRIPTION
            BREAKDOWN_TITLE
            BREAKDOWN_LABEL
            COUNT_CHART_TITLE
            COUNT_CHART_TOOLTIP
            PROPORTION_CHART_TITLE
            PROPORTION_CHART_TOOLTIP
            FOOTNOTE
          }
        }
        table {
          LAST_UPDATED
          TOP_LIMIT
          NORTH_DAKOTA_NOTE
          TEXAS_NOTE
          COUNTIES_NOTE
          TRACTS_NOTE
          ZIPS_NOTE
          STATES_NOTE
          NO_RESULTS
          DEFAULT_JUDGEMENTS_HINT
          REPORT_LINK
        }
      }
    }
    allGeojsonJson(filter: { name: { eq: $state }, region: { eq: "tracts" } }) {
      nodes {
        features {
          properties {
            GEOID
          }
          geometry {
            type
            coordinates
          }
          type
        }
      }
    }
    allCounties(filter: { geoid: { eq: $geoid } }) {
      nodes {
        geoid
        name
        region
        state
        lawsuits
        completed_lawsuits
        lawsuits_date
        default_judgement
        no_rep_percent
        top_collectors {
          amount
          collector
          lawsuits
        }
        collector_total
        lawsuit_history {
          lawsuits
          month
        }
        proportions {
          group
          tractPercent
          lawsuitPercent
        }
        tracts {
          geoid
          default_judgement
          lawsuits
          lawsuits_date
          name
          no_rep_percent
          lawsuit_history {
            lawsuits
            month
          }
          parentLocation
          percent_asian
          percent_black
          percent_latinx
          percent_other
          percent_white
          median_hhi
          majority
        }
      }
    }
  }
`;
