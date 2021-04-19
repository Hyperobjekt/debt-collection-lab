import React from "react";
import Layout from "../../components/layout";
import { graphql } from "gatsby";
import { default as Box } from "../../components/layout/responsive-box";
import Hero from "../../components/sections/hero";
import * as d3 from "d3";
import { Block } from "../../components/sections";
import Typography from "../../components/typography";
import FullTable from "../table/full-table";

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
  const stateCount = data.length;
  const countyCount = data.reduce((total, currentState) => {
    return total + currentState.counties.length;
  }, 0);
  const lawsuitTotal = data.reduce((total, currentState) => {
    return total + currentState.lawsuits;
  }, 0);
  const startDate = data.reduce((start, currentState) => {
    const d = getEarliestDate(currentState.lawsuit_history);
    return +d < +start ? d : start;
  }, new Date(8640000000000000));
  const endDate = data.reduce((end, currentState) => {
    const d = Date.parse(currentState.lawsuits_date);
    return d > end ? d : end;
  }, new Date(-8640000000000000));
  return { stateCount, countyCount, lawsuitTotal, startDate, endDate };
};

const IndexHero = ({
  stateCount,
  countyCount,
  lawsuitTotal,
  startDate,
  endDate,
}) => {
  return (
    <Hero ContainerProps={{ xs: { alignItems: "flex-start" } }}>
      <p>
        <Box fontSize={18} fontWeight={500} component="span" maxWidth={320}>
          In the {stateCount} states and {countyCount} counties we track, debt
          collectors filed
        </Box>
        <Box fontSize={100} fontWeight={700} component="span" maxWidth={320}>
          {intFormat(lawsuitTotal)}
        </Box>
        <Box fontSize={18} fontWeight={500} component="span" maxWidth={320}>
          lawsuits from {monthFormat(startDate)} to {monthFormat(endDate)}.
        </Box>
      </p>
    </Hero>
  );
};

const IndexAbout = () => {
  return (
    <Block ContainerProps={{ md: { flexDirection: "row" } }}>
      <Box maxWidth={320} mr={5}>
        <Typography weight="bold" variant="h4" component="h2">
          About the Debt Collection Tracker
        </Typography>
      </Box>
      <Box maxWidth={480}>
        <Typography>
          People who already had trouble paying their bills saw those troubles
          multiply during the Covid-19 pandemic. Although there were some
          moratoriums on debt collection, thousands of lawsuits were still being
          filed in a single county court per month. We have created the Debt
          Collection Lawsuit Tracker to monitor weekly updates to the number of
          debt cases being filed across the United States.
        </Typography>
      </Box>
    </Block>
  );
};

const IndexTable = () => {
  return <FullTable />;
};

export default function TrackerIndexLayout({ children, ...props }) {
  const data = props.data.allStates.nodes;

  return (
    <Layout {...props}>
      <IndexHero {...getHeroData(data)} />
      <IndexAbout />
      <IndexTable />
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
