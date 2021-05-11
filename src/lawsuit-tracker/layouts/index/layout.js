import React from "react";
import Layout from "../../../gatsby-theme-hypersite/layout";
import { graphql } from "gatsby";
import * as d3 from "d3";
import IndexTable from "./table";
import IndexHero from "./hero";
import IndexAbout from "./about";
import { getDateRange, getTotals } from "../../utils";
import { getImage } from "gatsby-plugin-image";

const intFormat = d3.format(",d");
const monthFormat = d3.timeFormat("%B %Y");

export default function TrackerIndexLayout({ children, ...props }) {
  const data = props.data.allStates.nodes;
  const { stateCount, countyCount, lawsuitTotal } = getTotals(data);
  const dateRange = getDateRange(data);
  const content = props.data.allLawsuitTrackerJson.nodes[0];
  const image = getImage(props.data.allFile.nodes[0]);
  console.log({ image });
  return (
    <Layout {...props}>
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
      <IndexTable
        data={data}
        trendRange={dateRange}
        stateCount={stateCount}
        countyCount={countyCount}
        lastUpdated={monthFormat(dateRange[1])}
        content={{ ...content.index.table, ...content.table }}
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
    allLawsuitTrackerJson {
      nodes {
        index {
          about {
            TITLE
            DESCRIPTION
            LINKS {
              name
              link
            }
          }
          hero {
            FIRST_LINE
            SECOND_LINE
          }
          table {
            TITLE
            DESCRIPTION
          }
        }
        table {
          LAST_UPDATED
          TOP_LIMIT
          NORTH_DAKOTA_NOTE
          TEXAS_NOTE
          COUNTIES_NOTE
          ZIPS_NOTE
          STATES_NOTE
          NO_RESULTS
          REPORT_LINK
        }
      }
    }
  }
`;
