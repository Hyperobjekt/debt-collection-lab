import React from "react";
import Layout from "../../gatsby-theme-hypersite/layout";
import {
  LocationHero,
  LawsuitsChartSection,
  LawsuitsMapSection,
  DebtCollectorsSection,
  DemographicChartSection,
  TableSection,
  ShareBlock,
} from "../sections";
import {
  getTopCollectorsData,
  getLawsuitChartData,
  getLocationHeroData,
  getDemographicChartData,
  getLawsuitMapData,
} from "../utils";

export default function SubpageLayout({
  children,
  meta,
  image,
  type,
  data,
  geojson,
  content,
  ...props
}) {
  const region = data.region;
  const hasDemographicChart =
    type === "county" || (region === "zips" && data.zips.length > 0);
  return (
    <Layout meta={meta} {...props}>
      <LocationHero
        image={image}
        content={content[type].hero}
        data={getLocationHeroData(data)}
      ></LocationHero>
      <DebtCollectorsSection
        content={content[type].collectors}
        data={getTopCollectorsData(data)}
      />
      <LawsuitsChartSection
        content={content[type].lawsuits}
        data={getLawsuitChartData(data)}
      />
      <LawsuitsMapSection
        content={content[type].map}
        data={getLawsuitMapData(data, geojson, region)}
      />
      <TableSection
        views={[region]}
        content={{ ...content[type].table, ...content.table }}
        data={[data]}
      />
      {hasDemographicChart && (
        <DemographicChartSection
          content={content[type].demographics}
          data={getDemographicChartData(data, region)}
        />
      )}
      <ShareBlock />
    </Layout>
  );
}
