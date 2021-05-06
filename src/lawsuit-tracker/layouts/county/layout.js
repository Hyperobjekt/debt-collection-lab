import React from "react";
import Layout from "../../../gatsby-theme-hypersite/layout";
import { graphql } from "gatsby";
import {
  LocationHero,
  LawsuitsChartSection,
  LawsuitsMapSection,
  DebtCollectorsSection,
  DemographicChartSection,
  TableSection,
} from "../../sections";
import {
  getTopCollectorsData,
  getTrackerUrl,
  getLawsuitChartData,
  getLocationHeroData,
  getDemographicChartData,
  getLawsuitMapData,
} from "../../utils";
import Breadcrumb from "../../../components/breadcrumb";
import { Container } from "@hyperobjekt/material-ui-website";
import { slugify } from "../../../utils";

export default function TrackerCountyLayout({
  children,
  pageContext,
  ...props
}) {
  const data = props.data.allCounties.nodes[0];
  const geojson = props.data.allGeojsonJson.nodes[0];
  const demographics = props.data.allDemographics.nodes;
  
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
      id: 'state',
      name: data.state,
      link: getTrackerUrl({ name: data.state }),
    },
    {
      id: 'county',
      name: data.name,
      link: getTrackerUrl(data),
    },
  ];

  return (
    <Layout pageContext={pageContext} {...props}>
      <Container>
        <Breadcrumb
          data={data}
          links={breadcrumb}
          style={{ position: "absolute", top: 0, zIndex: 10 }}
        />
      </Container>
      <LocationHero {...getLocationHeroData(data)}></LocationHero>
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
        description={`${data.name} is split into ${data.tracts.length} census tracts.  On the map you can see the number of lawsuits corresponding to each census tract.`}
        data={getLawsuitMapData(data, geojson, "tracts")}
      />
      <TableSection
        title="Overview of Lawsuits by Census Tract"
        description={`The table to the right shows data for the ${data.tracts.length} census tracts in ${data.name}.  Use the search below to find a specific tract.`}
        data={[data]}
      />
      <DemographicChartSection
        title="Debt Collection Lawsuits by Neighborhood Demographics"
        description="Based on data from the American Community Survey, census tracts have been categorized by ther racial/ethnic majority."
        data={getDemographicChartData(data, demographics)}
      />
      {children}
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </Layout>
  );
}

export const query = graphql`
  query($geoid: String!, $state: String!) {
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
        state
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
        }
      }
    }
    allDemographics(filter: { parentLocation: { eq: $geoid } }) {
      nodes {
        geoid
        parentLocation
        percent_asian
        percent_black
        percent_latinx
        percent_other
        percent_white
        majority
      }
    }
  }
`;
