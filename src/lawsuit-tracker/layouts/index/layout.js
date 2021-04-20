import React from "react";
import Layout from "../../../components/layout";
import { graphql } from "gatsby";
import * as d3 from "d3";
import FullTable from "../../table/full-table";
import IndexHero from "./hero";
import IndexAbout from "./about";

const intFormat = d3.format(",d");
const monthFormat = d3.timeFormat("%B %Y");
const monthParse = d3.timeParse("%m/%Y");

const getEarliestDate = (data) => {
  return data.reduce((start, current) => {
    // ignore invalid dates
    if (current.month.indexOf("1969") > -1) return start;
    const d = monthParse(current.month);
    return +d < +start ? d : start;
  }, new Date(8640000000000000));
};

const getHeroData = (data) => {
  // number of states in the data
  const stateCount = data.length;
  // number of counties in the data
  const countyCount = data.reduce((total, currentState) => {
    return total + currentState.counties.length;
  }, 0);
  // total number of lawsuits across states
  const lawsuitTotal = data.reduce((total, currentState) => {
    return total + currentState.lawsuits;
  }, 0);
  // earliest date in lawsuit history
  const startDate = data.reduce((start, currentState) => {
    const d = getEarliestDate(currentState.lawsuit_history);
    return +d < +start ? d : start;
  }, new Date(8640000000000000));
  // latest date in lawsuit history
  const endDate = data.reduce((end, currentState) => {
    const d = Date.parse(currentState.lawsuits_date);
    return d > end ? d : end;
  }, new Date(-8640000000000000));
  // return formatted values
  return {
    stateCount,
    countyCount,
    lawsuitTotal: intFormat(lawsuitTotal),
    startDate: monthFormat(startDate),
    endDate: monthFormat(endDate),
  };
};

export default function TrackerIndexLayout({ children, ...props }) {
  const data = props.data.allStates.nodes;
  return (
    <Layout {...props}>
      <IndexHero {...getHeroData(data)} />
      <IndexAbout />
      <FullTable />
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
