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
  formatPercent,
  formatInt,
} from "../../utils";

export default function TrackerCountyLayout({
  children,
  pageContext,
  ...props
}) {
  const data = props.data.allCounties.nodes[0];
  const geojson = props.data.allGeojsonJson.nodes[0];
  const demographics = props.data.allDemographics.nodes;

  const Tooltip = (classes, selected) => {
    return (
      <div className={classes.tooltip} style={{top: selected.event.offsetCenter.y, left: selected.event.offsetCenter.x, }}>
          <h1 className={classes.title}>{ selected.info.properties.name }</h1>
          <div className={classes.item}>{ formatInt(selected.info.properties.value) } lawsuits</div>
          {Object.keys(selected.info.properties.demographics).map((l) => (
              <div className={classes.item}>{ `${formatPercent(selected.info.properties.demographics[l].value)} ${selected.info.properties.demographics[l].label}` }</div>
          ))}
      </div>
    )
  }

  return (
    <Layout meta={pageContext.frontmatter.meta} {...props}>
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
        data={getLawsuitMapData(data, geojson, "tracts", demographics)}
        tooltip={Tooltip}
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
