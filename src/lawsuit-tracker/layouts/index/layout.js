import React from "react";
import Layout from "../../../gatsby-theme-hypersite/layout";
import { graphql } from "gatsby";
import * as d3 from "d3";
import IndexTable from "./table";
import IndexHero from "./hero";
import IndexAbout from "./about";
import { getDateRange, getTotals } from "../../utils";

const intFormat = d3.format(",d");
const monthFormat = d3.timeFormat("%B %Y");

export default function TrackerIndexLayout({ children, ...props }) {
  const data = props.data.allStates.nodes;
  const { stateCount, countyCount, lawsuitTotal } = getTotals(data);
  const dateRange = getDateRange(data);
  return (
    <Layout {...props}>
      <IndexHero
        stateCount={stateCount}
        countyCount={countyCount}
        lawsuitTotal={intFormat(lawsuitTotal)}
        startDate={monthFormat(dateRange[0])}
        endDate={monthFormat(dateRange[1])}
      />
      <IndexAbout />
      <IndexTable
        data={data}
        trendRange={dateRange}
        stateCount={stateCount}
        countyCount={countyCount}
      />
      {children}
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </Layout>
  );
}

export const query = graphql`
  {
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
  }
`;
