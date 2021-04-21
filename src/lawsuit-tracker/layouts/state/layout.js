import React from "react";
import Layout from "../../../components/layout";
import { graphql } from "gatsby";
import {
  LocationHero,
  LawsuitsChartSection,
  LawsuitsMapSection,
  DebtCollectorsSection,
  TableSection,
} from "../../sections";
import {
  getLocationHeroData,
  getTopCollectorsData,
  getTrackerUrl,
} from "../../utils";
import Breadcrumb from "../../../components/layout/breadcrumb";

export default function TrackerCountyLayout({
  children,
  pageContext,
  ...props
}) {
  const data = props.data.allStates.nodes[0];
  const context = {
    ...pageContext,
    frontmatter: {},
  };
  const breadcrumb = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Debt Collection Tracker",
      link: "/lawsuit-tracker",
    },
    {
      name: data.name,
      link: getTrackerUrl(data),
    },
  ];
  return (
    <Layout pageContext={context} {...props}>
      <LocationHero {...getLocationHeroData(data)}>
        <Breadcrumb
          links={breadcrumb}
          style={{ position: "absolute", top: 8 }}
        />
      </LocationHero>
      <LawsuitsChartSection
        title="Debt Collection By Year"
        data={data.lawsuit_history}
      />
      <DebtCollectorsSection
        title="Top Debt Collectors"
        data={getTopCollectorsData(data)}
      />
      <LawsuitsMapSection
        title="Geography of Debt Collection Lawsuits"
        description={`${data.name} is split into ${data.counties.length} counties.  On the map you can see the number of lawsuits corresponding to each census tract.`}
        data={data.counties}
      />
      <TableSection
        title="Overview of Lawsuits by County"
        description={`The table to the right shows data for the ${data.counties.length} counties in ${data.name}.  Use the search below to find a specific county.`}
        views={["counties"]}
        data={[data]}
      />
      {children}
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </Layout>
  );
}

export const query = graphql`
  query($geoid: String!) {
    allStates(filter: { geoid: { eq: $geoid } }) {
      nodes {
        geoid
        name
        lawsuits
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
        counties {
          default_judgement
          geoid
          lawsuits
          lawsuits_date
          name
          no_rep_percent
          lawsuit_history {
            lawsuits
            month
          }
        }
      }
    }
  }
`;
