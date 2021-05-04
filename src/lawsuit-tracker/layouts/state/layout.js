import React from "react";
import Layout from "../../../gatsby-theme-hypersite/layout";
import { graphql } from "gatsby";
import {
  LocationHero,
  LawsuitsChartSection,
  LawsuitsMapSection,
  DebtCollectorsSection,
  TableSection,
} from "../../sections";
import {
  getLawsuitChartData,
  getLawsuitMapData,
  getLocationHeroData,
  getTopCollectorsData,
  getTrackerUrl,
} from "../../utils";
import Breadcrumb from "../../../components/breadcrumb";
import { Container } from "@hyperobjekt/material-ui-website";

export default function TrackerCountyLayout({
  children,
  pageContext,
  ...props
}) {
  const data = props.data.allStates.nodes[0];
  const geojson = props.data.allGeojsonJson.nodes[0];
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
      <Container>
        <Breadcrumb
          links={breadcrumb}
          style={{ position: "absolute", top: 0, zIndex: 10 }}
        />
      </Container>
      <LocationHero {...getLocationHeroData(data)} />
      <DebtCollectorsSection
        title="Top Debt Collectors"
        data={getTopCollectorsData(data)}
      />
      <LawsuitsChartSection
        title="Debt Collection Lawsuits By Year"
        data={getLawsuitChartData(data)}
      />
      <LawsuitsMapSection
        title="Geography of Debt Collection Lawsuits"
        description={`${data.name} is split into ${data.counties.length} counties.  On the map you can see the number of lawsuits corresponding to each census tract.`}
        data={getLawsuitMapData(data, geojson, "counties")}
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
  query($geoid: String!, $state: String!) {
    allGeojsonJson(
      filter: { name: { eq: $state }, region: { eq: "counties" } }
    ) {
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
