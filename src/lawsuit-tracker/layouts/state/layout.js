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
  getDemographicChartData,
  getLawsuitChartData,
  getLawsuitMapData,
  getLocationHeroData,
  getTopCollectorsData,
  getTrackerUrl,
} from "../../utils";
import Breadcrumb from "../../../components/breadcrumb";
import { Container } from "@hyperobjekt/material-ui-website";

const getSingularRegion = (region, casing) => {
  const regions = {
    states: "State",
    counties: "County",
    zips: "Zip Code",
  };
  return casing === "lower" ? regions[region].toLowerCase() : regions[region];
};

export default function TrackerCountyLayout({
  children,
  pageContext,
  ...props
}) {
  const data = props.data.allStates.nodes[0];
  console.log(props);
  const geojson = props.data.allGeojsonJson.nodes[0];
  const demographics = props.data.allDemographics.nodes;
  const breadcrumb = [
    {
      id: "home",
      name: "Home",
      link: "/",
    },
    {
      id: "tracker",
      name: "Debt Collection Tracker",
      link: "/lawsuit-tracker",
    },
    {
      id: "state",
      name: data.name,
      link: getTrackerUrl(data),
    },
  ];
  const region = data.region;
  const subRegions = data.region === "zips" ? data.zips : data.counties;
  return (
    <Layout pageContext={pageContext} {...props}>
      <Container>
        <Breadcrumb
          data={data}
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
        description={`${data.name} is split into ${subRegions.length} ${region}.  On the map you can see the number of lawsuits corresponding to each census tract.`}
        data={getLawsuitMapData(data, geojson, region)}
      />
      <TableSection
        title={`Overview of Lawsuits by ${getSingularRegion(region)}`}
        description={`The table to the right shows data for the ${subRegions.length} ${region} in ${data.name}.  Use the search below to find a specific county.`}
        views={[region]}
        data={[data]}
      />
      {demographics.length > 0 && <DemographicChartSection
        title="Debt Collection Lawsuits by Neighborhood Demographics"
        description="Based on data from the American Community Survey, census tracts have been categorized by ther racial/ethnic majority."
        data={getDemographicChartData(data, demographics, region)}
      />}
      {children}
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </Layout>
  );
}

export const query = graphql`
  query first($geoid: String!, $state: String!, $region: String!) {
    allGeojsonJson(filter: { name: { eq: $state }, region: { eq: $region } }) {
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
        region
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
        zips {
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
