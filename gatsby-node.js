const d3 = require("d3");
const path = require("path");
const { getStateNameForFips, loadCsv, slugify } = require("./scripts/utils");
const { titleCase } = require("title-case");
const createSocialImage = require("./scripts/createSocialImage");
const MONTH_PARSE = d3.timeParse("%m/%Y");
const formatPercent = d3.format(".1%");
const formatInt = d3.format(",d");
/**
 * Returns an array of county objects
 * @param {*} data
 * @returns
 */
function getCounties(data) {
  const counties = data.filter((d) => d.geoid.length === 5);
  return counties.map((c) => ({
    ...c,
    state: getStateNameForFips(c.geoid),
    region: "tracts",
    tracts: data.filter(
      (d) => d.geoid.length > 5 && d.geoid.indexOf(c.geoid) === 0
    ),
  }));
}

/**
 * Returns an array of state objects
 * @param {*} data
 * @returns
 */
function getStates(data) {
  const states = data.filter((d) => d.geoid.length === 2);
  return states.map((s) => {
    const zips = data
      .filter((d) => d.geoid.length === 7 && d.geoid.indexOf(s.geoid) === 0)
      .map((c) => ({ ...c, state: s.name }));
    return {
      ...s,
      region: zips?.length > 0 ? "zips" : "counties",
      counties: data
        .filter((d) => d.geoid.length === 5 && d.geoid.indexOf(s.geoid) === 0)
        .map((c) => ({ ...c, state: s.name })),
      zips,
    };
  });
}

/**
 * Creates source nodes for a dataset
 * @param {*} id
 * @param {*} data
 * @param {*} param2
 */
const createSourceNodes = (
  id,
  data,
  { actions, createNodeId, createContentDigest, reporter }
) => {
  const activity = reporter.activityTimer(`created source node for ${id}`);
  activity.start();
  data.forEach((d, i) => {
    const node = {
      ...d,
      id: createNodeId(`${id}-${i}`),
      internal: {
        type: id,
        contentDigest: createContentDigest(d),
      },
    };
    actions.createNode(node);
  });
  activity.end();
};

const getCollectorName = (collector) => {
  const uppercase = ["LLC", "LVNV"];
  return titleCase(collector.slice(0, -1).substring(1))
    .split(" ")
    .map((w) => (uppercase.indexOf(w.toUpperCase()) > -1 ? w.toUpperCase() : w))
    .join(" ");
};

/**
 * Parses a row from the lawsuits csv
 * @param {object} row
 * @returns {object}
 */
const lawsuitParser = (row) => {
  if (isNaN(Number(row.default_judgement)))
    console.log(row.id, row.default_judgement);
  return {
    geoid: row.id,
    name: row.name,
    lawsuits: Number(row.lawsuits),
    lawsuits_date: MONTH_PARSE(row.lawsuits_date),
    lawsuit_history: row.lawsuit_history
      .split("|")
      .map((v) => ({
        month: v.split(";")[0],
        lawsuits: Number(v.split(";")[1]),
      }))
      .filter((d) => d.month.indexOf("1969") === -1),
    top_collectors: row.collectors.split("|").map((v) => {
      const values = v.split(";");
      return {
        collector: getCollectorName(values[0]),
        lawsuits: Number(values[1]),
        amount: Number(values[2]),
      };
    }),
    collector_total: Number(row.collector_total),
    default_judgement: Number(row.default_judgement),
    no_rep_percent: Number(row.no_rep_percent),
  };
};

/**
 * Returns the racial majority given % breakdown
 * @param {*} data
 * @returns
 */
const getMajority = (data) => {
  if (data.percent_asian > 0.5) return "Asian";
  if (data.percent_black > 0.5) return "Black";
  if (data.percent_latinx > 0.5) return "Latinx";
  if (data.percent_white > 0.5) return "White";
  if (data.percent_other > 0.5) return "Other";
  return "No Majority";
};

/**
 * Takes a value and returns a number, returns empty string if not a number
 * @param {*} value
 * @returns
 */
const getNumberValue = (value) => {
  const result = Number(value);
  return isNaN(result) ? -1 : result;
};

/**
 * Takes a GEOID and returns the parent identifier
 * @param {*} geoid
 * @returns
 */
const getParentValue = (geoid) => {
  // census tracts
  if (geoid.length === 11) return geoid.slice(0, 5); // county geoid
  // zip codes
  if (geoid.length === 7) return geoid.slice(0, 2); // state geoid
  // TODO: state zip without prefix, assume north dakota for now, but should have data format changed to include state
  if (geoid.length === 5) return "38"; // state geoid
  return "";
};

// HACK: zips should have state prefixed, this prepends ND because it is currently the only state with zips
// TODO: have Jeff prepend zip GEOIDs with state FIPS
const getGeoid = (geoid) => (geoid.length === 5 ? "38" + geoid : geoid);

/**
 * Parses a row from the lawsuits csv
 * @param {object} row
 * @returns {object}
 */
const demographicParser = (row) => {
  const result = {
    geoid: getGeoid(row.GEOID),
    parentLocation: getParentValue(row.GEOID),
    percent_asian: getNumberValue(row.percent_asian),
    percent_black: getNumberValue(row.percent_black),
    percent_latinx: getNumberValue(row.percent_latinx),
    percent_white: getNumberValue(row.percent_white),
    percent_other: getNumberValue(row.percent_other),
  };
  const majority = getMajority(result);
  return {
    ...result,
    majority,
  };
};

const createCountyPages = async ({ graphql, actions }) => {
  const CountyTemplate = require.resolve(
    `./src/lawsuit-tracker/layouts/county/layout.js`
  );
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allCounties {
        nodes {
          geoid
          name
          lawsuits
          no_rep_percent
          default_judgement
        }
      }
    }
  `);
  const counties = result.data.allCounties.nodes;
  await Promise.all(
    counties.map(
      async ({ geoid, name, lawsuits, no_rep_percent, default_judgement }) => {
        if (name) {
          const stateName = getStateNameForFips(geoid);
          const slugStateName = slugify(stateName);
          const pageName = slugify(name);
          const socialImage = await createSocialImage(
            name,
            [
              formatInt(lawsuits),
              formatPercent(no_rep_percent),
              formatPercent(default_judgement / lawsuits),
            ],
            slugStateName
          );
          createPage({
            path: `/lawsuit-tracker/${slugStateName}/${pageName}/`,
            component: CountyTemplate,
            context: {
              slug: pageName,
              county: name,
              state: stateName,
              geoid: geoid,
              frontmatter: {
                meta: {
                  title: name,
                  description: `People in ${name} have had ${lawsuits} debt collection lawsuits filed against them since we started tracking.`,
                  image: socialImage,
                },
              },
            },
          });
        }
      }
    )
  );
};

const createStatePages = async ({ graphql, actions }) => {
  const StateTemplate = require.resolve(
    `./src/lawsuit-tracker/layouts/state/layout.js`
  );
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allStates {
        nodes {
          geoid
          name
          lawsuits
          no_rep_percent
          default_judgement
          zips {
            geoid
          }
        }
      }
    }
  `);
  const states = result.data.allStates.nodes;

  await Promise.all(
    states.map(
      async ({
        geoid,
        name,
        lawsuits,
        no_rep_percent,
        default_judgement,
        zips,
      }) => {
        if (name && name !== "Texas") {
          const pageName = slugify(name);
          const socialImage = await createSocialImage(name, [
            formatInt(lawsuits),
            formatPercent(no_rep_percent),
            formatPercent(default_judgement / lawsuits),
          ]);
          createPage({
            path: `/lawsuit-tracker/${pageName}/`,
            component: StateTemplate,
            context: {
              slug: pageName,
              state: name,
              geoid: geoid,
              region: zips?.length > 0 ? "zips" : "counties",
              frontmatter: {
                meta: {
                  title: name,
                  description: `People in ${name} have had ${lawsuits} debt collection lawsuits filed against them since we started tracking.`,
                  image: socialImage,
                  // TODO: generate a dynamic social image
                },
              },
            },
          });
        }
      }
    )
  );
};

const createLawsuitTrackerIndex = async ({ graphql, actions }) => {
  const IndexTemplate = require.resolve(
    `./src/lawsuit-tracker/layouts/index/layout.js`
  );
  const { createPage } = actions;
  createPage({
    path: `/lawsuit-tracker/`,
    component: IndexTemplate,
    context: {
      frontmatter: {
        meta: {
          title: "Debt Collection Tracker",
        },
      },
    },
  });
};

exports.sourceNodes = async (params) => {
  const lawsuits = loadCsv("./static/data/lawsuits.csv", lawsuitParser);
  createSourceNodes("States", getStates(lawsuits), params);
  createSourceNodes("Counties", getCounties(lawsuits), params);
  const demographicData = loadCsv(
    "./static/data/demographics.csv",
    demographicParser
  );
  createSourceNodes("Demographics", demographicData, params);
};

exports.createPages = async ({ graphql, actions }) => {
  await createLawsuitTrackerIndex({ graphql, actions });
  await createStatePages({ graphql, actions });
  await createCountyPages({ graphql, actions });
};

// allow import of local components
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes, createFieldExtension } = actions;

  const frontmatterTypeDefs = `
    type MdxFrontmatter implements Node {
      name: String
      draft: Boolean
      path: String!
      alias: String
      lang: String
      template: String
      meta: SeoFrontmatter!
      embeddedImages: [File] @fileByRelativePath
      team: [TeamMember]
    }
    type SeoFrontmatter {
      title: String!
      description: String
      keywords: String
      image: File @fileByRelativePath
      isBlogPost: Boolean
    }
    type TeamMember {
      name: String
      title: String
      bio: String
      headshot: String
      headshot_thumbnail: File @fileByRelativePath
    }
  `;
  createTypes(frontmatterTypeDefs);
};
