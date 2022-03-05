"use strict";
if (!globalThis.fetch) {
  globalThis.fetch = require("node-fetch");
}
const d3 = require("d3");
const { loadCsv, writeFile, slugify } = require("./utils");

const csvShapes = ["states", "counties"];

// only pull data for these states
const VALID_STATE_FIPS = ["09", "48", "38", "18", "29"];
const LOWER_BOUND_DATE = d3.timeParse("%m/%d/%Y")("1/1/2018");
const DATE_FORMAT = d3.timeFormat("%m/%Y");
const MONTH_PARSE = d3.timeParse("%m/%Y");

// functions to select different geography identifiers
const isValid = (id) => id && VALID_STATE_FIPS.indexOf(id.substring(0, 2)) > -1;
const STATE_SELECTOR = (d) => isValid(d.id) && d.id.substring(0, 2);
const COUNTY_SELECTOR = (d) =>
  isValid(d.id) && d.id.length === 11 && d.id.substring(0, 5);
const ZIP_SELECTOR = (d) => isValid(d.id) && d.id.length === 7 && d.id;
const TRACT_SELECTOR = (d) => isValid(d.id) && d.id.length === 11 && d.id;

function getName(id, name) {
  // zip codes
  if (id.length === 7) return name;
  // TODO: need a state lookup when getting name for states from zip codes
  if (id.length === 2)
    return name.indexOf(",") > -1
      ? name.split(",").pop().trim()
      : "North Dakota";
  if (id.length === 5) return name.split(",")[1].trim();
  return name.split(",")[0].trim();
}

function aggregateLawsuits(data, region) {
  // shape lawsuit history
  const lawsuitsByMonth = d3.group(data, (d) => d.date);
  const monthDates = Array.from(lawsuitsByMonth.keys()).sort((a, b) => a - b);
  const values = monthDates
    .map((v) => [DATE_FORMAT(v), lawsuitsByMonth.get(v).length].join(";"))
    .join("|");

  // shape top 10 debt collectors
  const lawsuitsByCollectorRaw = d3.groups(data, (d) =>
    d.plaintiff
      .toLowerCase()
      .replace(/"/g, "")
      .replace(/,/g, "")
      .replace("inc.", "inc")
      .replace("llc.", "llc")
      .replace(" assignee of credit one bank n.a.", "")
  );

  const lawsuitsByCollector = lawsuitsByCollectorRaw.map(
    ([collector, lawsuits]) => [
      `'${collector}'`,
      lawsuits.length,
      d3.sum(lawsuits, (d) => d.amount),
      d3.sum(lawsuits, (d) => d.default_judgement), // TODO: remove?
    ]
  );

  const collectorTotal = lawsuitsByCollector.length;

  const name = getName(data[0].id, data[0].name);

  if (csvShapes.includes(region)) {
    // TODO: refactor
    const D21 = new Date("1/1/2021");
    const totals = { count: 0, count20: 0, count21: 0 };
    const lawsuitsByCollectorForEx = lawsuitsByCollectorRaw
      .map(([collector, lawsuits]) => ({
        collector,
        count: lawsuits.length,
        count20: d3.sum(lawsuits, ({ date }) => {
          const D = new Date(date);
          if (D < D21) {
            totals.count += 1;
            totals.count20 += 1;
            return 1;
          } else {
            return 0;
          }
        }),
        count21: d3.sum(lawsuits, ({ date }) => {
          const D = new Date(date);
          if (D >= D21) {
            totals.count += 1;
            totals.count21 += 1;
            return 1;
          } else {
            return 0;
          }
        }),
        dollar_amount: d3.sum(lawsuits, (d) => d.amount),
        dollar_amount20: d3.sum(lawsuits, ({ date, amount }) => {
          const D = new Date(date);
          return D < D21 ? amount : 0;
        }),
        dollar_amount21: d3.sum(lawsuits, ({ date, amount }) => {
          const D = new Date(date);
          return D >= D21 ? amount : 0;
        }),
        // count_with_representation: d3.sum(lawsuits, (d) => d.representation),
        // count_default_judgement: d3.sum(lawsuits, (d) => d.default_judgement),
        // count_case_completed: d3.sum(lawsuits, (d) => d.case_completed),
      }))
      .map(
        ({
          collector,
          count,
          count20,
          count21,
          dollar_amount,
          dollar_amount20,
          dollar_amount21,
        }) => {
          const percent_total = d3.format(".1%")(count / totals.count);
          const percent_total20 = d3.format(".1%")(count20 / totals.count20);
          const percent_total21 = d3.format(".1%")(count21 / totals.count21);
          return {
            collector,
            count,
            percent_total,
            dollar_amount,
            count21,
            percent_total21,
            dollar_amount21,
            count20,
            percent_total20,
            dollar_amount20,
          };
        }
      )
      .sort((a, b) => b.count - a.count);
    // console.log(region, name, i, lawsuitsByCollectorRaw);
    writeFile(
      jsonToCsv(lawsuitsByCollectorForEx),
      `./static/data/${slugify(name)}.csv`
    );
  }

  const topCollectors = lawsuitsByCollector
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((d) => d.join(";"))
    .join("|");

  return {
    id: data[0].id,
    name,
    lawsuits: data.length,
    // NOTE: some d_j cases are erroneously marked as not complete (per email from Jeff)
    completed_lawsuits: data.filter(
      (d) => d.case_completed === 1 || d.default_judgement === 1
    ).length,
    lawsuits_date: DATE_FORMAT(monthDates[monthDates.length - 1]),
    lawsuit_history: values,
    collectors: `"${topCollectors}"`,
    collector_total: collectorTotal,
    amount: d3.sum(data, (d) => d.amount),
    default_judgement: data.filter((d) => d.default_judgement === 1).length,
    no_rep_percent: data.filter((d) => !d.representation).length / data.length,
  };
}

// const txNonHarris = [];
// const ndNonZip = [];
function filterInvalidLocation(d) {
  const stateFips = d.id.substring(0, 2);
  // filter out non-Harris County counties from texas
  if (stateFips === "48" && d.id.length === 5 && d.id !== "48201") {
    // txNonHarris.push(JSON.stringify({ name: d.name }));
    // console.log(
    //   "removing county that is not Harris County",
    //   JSON.stringify({ id: d.id, name: d.name })
    // );
    return false;
  }
  // filter out North Dakota counties (use zip only)
  if (stateFips === "38" && d.id.length === 5) {
    // ndNonZip.push(JSON.stringify({ name: d.name }));
    // console.log(
    //   "removing county from North Dakota (zips only)",
    //   JSON.stringify({ id: d.id, name: d.name })
    // );
    return false;
  }
  return true;
}

const getSelectorForRegion = (region) => {
  const shapers = {
    states: STATE_SELECTOR,
    counties: COUNTY_SELECTOR,
    tracts: TRACT_SELECTOR,
    zips: ZIP_SELECTOR,
  };
  if (!shapers[region]) throw new Error("no shaper for region: " + region);
  return shapers[region];
};

const aggregateByRegion = (data, region) => {
  console.log("-----");
  console.log(`SHAPING DATA FOR REGION: ${region}`);
  console.log("-----");
  const selector = getSelectorForRegion(region);
  const result = aggregateBySelector(data, selector, region);
  console.log("done shaping states");
  return result;
};

/**
 * Aggregate data based on identifier
 * @param {*} id
 * @param {*} data
 */
function aggregateBySelector(data, selector = (d) => d.id, region) {
  const reshapedIdData = data
    .map((d) => ({ ...d, id: selector(d) }))
    .filter((d) => Boolean(d.id)) // remove rows where valid id was not returned
    .filter(filterInvalidLocation);
  const groups = d3.groups(reshapedIdData, (d) => d.id);
  // if (blah) console.log(JSON.stringify(groups));
  // blah = false;
  // console.log(groups.length, groups[0].length, groups[1].length);
  return groups.reduce((result, current, i) => {
    result.push(aggregateLawsuits(current[1], region, i));
    return result;
  }, []);
}

// const badDates = [];
const dateToMonthDate = (date, dateFormat = "%Y-%m-%d") => {
  if (!date) {
    // badDates.push(JSON.stringify({ missing: null }));
    return null;
  }

  const dateParse = d3.timeParse(dateFormat);
  const parsed = dateParse(date);

  if (parsed < LOWER_BOUND_DATE) {
    // badDates.push(JSON.stringify({ outdated: date }));
    return null;
  }

  return MONTH_PARSE(DATE_FORMAT(parsed));
};

const jsonToCsv = (jsonData) => {
  const headers = Object.keys(jsonData[0]).join(",");
  const data = jsonData.map((d) => Object.values(d).join(","));
  return [headers, ...data].join("\n");
};

async function shapeFullData() {
  const path = "https://debtcases.s3.us-east-2.amazonaws.com/lawsuit_data.csv";
  const parser = (d) => {
    return {
      id: d.id,
      name: d.name,
      plaintiff: d.plaintiff,
      date: dateToMonthDate(d.date),
      default_judgement: Number(d.default_judgment),
      amount: Number(d.amount),
      representation: Number(d.has_representation),
      case_completed: Number(d.case_completed),
    };
  };

  const csvData = await loadCsv(path, parser);
  // TODO: revert
  // const csvData = await loadCsv("./static/data/lawsuit_data-4.csv", parser);
  const data = csvData
    .filter((d) => d.id && d.id !== "NA")

    .map((d) => {
      // add state fips to zip code
      // TODO: need a way to determine state from zip code
      // - have Jeff add a column with state fips
      if (
        d.id &&
        d.id.length === 5 &&
        d.id === d.name &&
        ["57", "58"].indexOf(d.id.substring(0, 2)) > -1
      ) {
        // Assuming all zips belong to North Dakota
        return {
          ...d,
          id: "38" + d.id,
          name: "Zip " + d.id,
        };
      }
      return d;
    });
  const debtData = [
    ...aggregateByRegion(data, "states"),
    ...aggregateByRegion(data, "counties"),
    ...aggregateByRegion(data, "tracts"),
    ...aggregateByRegion(data, "zips"),
  ];
  return debtData;
}

async function shape() {
  const debtData = await shapeFullData();
  // drop totals for Texas
  const output = debtData
    .map((d) => {
      if (d.name !== "Texas") return d;
      return {
        ...d,
        lawsuits: 0,
        completed_lawsuits: 0,
        lawsuits_date: "04/2021",
        lawsuit_history: "01/2018;0",
        collectors: "",
        collector_total: 0,
        amount: 0,
        default_judgement: 0,
        no_rep_percent: 0,
      };
    })
    .filter((d) => Boolean(d.id));
  // writeFile(badDates.join("\n"), "./static/data/dates");
  await writeFile(jsonToCsv(output), "./static/data/lawsuits.csv");
  console.log("wrote file to ./static/data/lawsuits.csv");
}

shape();
