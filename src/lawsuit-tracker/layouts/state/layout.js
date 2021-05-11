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

export default function TrackerCountyLayout({
  children,
  pageContext,
  ...props
}) {
  const data = props.data.allStates.nodes[0];
  const geojson = props.data.allGeojsonJson.nodes[0];

  const Tooltip = (classes, selected) => {
    return (
      <div className={classes.tooltip} style={{top: selected.event.offsetCenter.y, left: selected.event.offsetCenter.x, opacity: selected.info ? 0.87 : 0}}>
          <h1 className={classes.title}>{ selected.info.properties.name }</h1>
          <div className={classes.item}>{ selected.info.properties.value } lawsuits</div>
      </div>
    )
  }

  const region = data.region;
  const subRegions = data.region === "zips" ? data.zips : data.counties;
  return (
    <Layout meta={pageContext.frontmatter.meta} {...props}>
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
        tooltip={Tooltip}
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

// export const statesQuery = graphql`{
//   query MyQuery {
//     allStates {
//       nodes {
//         name
//         counties {
//           geoid
//           name
//         }
//       }
//     }
//   }
// }
// `

export const query = graphql`
query first($geoid: String!, $state: String!) {
  allGeojsonJson(filter: {name: {eq: $state}, region: {eq: "counties"}}) {
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
  allStates(filter: {geoid: {eq: $geoid}}) {
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
