"use strict";
if (!globalThis.fetch) {
  globalThis.fetch = require("node-fetch");
}
const d3 = require("d3");
const {
  loadCsv,
  writeFile,
  getStateNameForFips,
  getCsvFileName,
} = require("./utils");

const CSV_DOWNLOAD_REGIONS = ["states", "counties"];

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

  const name = getName(data[0].id, data[0].name);

  // shape top 10 debt collectors
  const lawsuitsByCollectorRaw = d3
    .groups(data, (d) =>
      d.plaintiff
        .toLowerCase()
        // standardize some common spelling variations to facilitate proper accumulation
        .replace(/"/g, "")
        .replace(/,/g, "")
        .replace(/\n+/g, " ") // swap newlines for a space
        .replace(/\s\s+/g, " ") // swap multiple spaces for a single
        .replace("inc.", "inc")
        .replace("llc.", "llc")
        .replace("l.l.c.", "llc")
        .replace("n.a.", "na")
        .replace("st. louis", "st louis")
        .replace(" assignee of credit one bank n.a.", "")
        .replace(" c/o discover products inc", "")
        .replace(/lvnv funding llc.*/, "lvnv funding llc")
        .replace(/conn appliances inc.*/, "conn appliances inc")
        .replace(
          "midland credit management llc",
          "midland credit management inc"
        )
    )
    .filter(([collector, lawsuits]) => !collector.includes("added in error"));

  if (CSV_DOWNLOAD_REGIONS.includes(region)) {
    const stateName =
      region === "states" ? null : getStateNameForFips(data[0].id);
    const fileName = getCsvFileName(name, stateName);
    createCsvForRegion(lawsuitsByCollectorRaw, fileName);
  }

  const lawsuitsByCollector = lawsuitsByCollectorRaw.map(
    ([collector, lawsuits]) => [
      `'${collector}'`,
      lawsuits.length,
      d3.sum(lawsuits, (d) => d.amount),
    ]
  );

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
    collector_total: lawsuitsByCollector.length,
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
  // const output = result.reduce((accum, curr) => {
  //   return accum.concat({
  //     collectors: curr.collectors
  //       .split("|")
  //       .map((x) => x.split(";")[0])
  //       .join(" ,\n "),
  //     name: curr.name,
  //   });
  // }, []);
  // console.log("OP: ", output);
  // writeFile(jsonToCsv(output), `./static/data/${region}-fromjson.csv`);
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

function createCsvForRegion(lawsuitsByCollector, fileName) {
  const D21 = new Date("1/1/2021");
  const regionalTotalsMap = lawsuitsByCollector.reduce(
    (totals, [collector, lawsuits]) => {
      const lawsuits20 = lawsuits.filter((l) => l.date < D21);
      const lawsuits21 = lawsuits.filter((l) => l.date >= D21);

      totals.count += lawsuits.length;
      totals.count20 += lawsuits20.length;
      totals.count21 += lawsuits21.length;

      totals.dollar_amount += d3.sum(lawsuits, (d) => d.amount);
      totals.dollar_amount20 += d3.sum(lawsuits20, (d) => d.amount);
      totals.dollar_amount21 += d3.sum(lawsuits21, (d) => d.amount);

      return totals;
    },
    {
      count: 0,
      count20: 0,
      count21: 0,
      dollar_amount: 0,
      dollar_amount20: 0,
      dollar_amount21: 0,
    }
  );

  // show NaN as 0.0% (many dollar_amount totals are 0, resulting in division by 0)
  const percent_formatter = d3.formatLocale({ nan: "0.0" }).format(".2r");
  const processedLawsuits = lawsuitsByCollector
    .map(([collector, lawsuits], i) => {
      const lawsuits20 = lawsuits.filter((l) => l.date < D21);
      const lawsuits21 = lawsuits.filter((l) => l.date >= D21);

      const collectorCount = lawsuits.length;
      const collectorCount20 = lawsuits20.length;
      const collectorCount21 = lawsuits21.length;

      const dollar_amount = d3.sum(lawsuits, (d) => d.amount);
      const dollar_amount20 = d3.sum(lawsuits20, (d) => d.amount);
      const dollar_amount21 = d3.sum(lawsuits21, (d) => d.amount);

      return {
        collector: collector.toUpperCase(),

        count: collectorCount,
        count21: collectorCount21,
        count20: collectorCount20,

        percent_total: percent_formatter(
          collectorCount / regionalTotalsMap.count
        ),
        percent_total21: percent_formatter(
          collectorCount21 / regionalTotalsMap.count21
        ),
        percent_total20: percent_formatter(
          collectorCount20 / regionalTotalsMap.count20
        ),

        dollar_amount: Math.round(dollar_amount),
        dollar_amount21: Math.round(dollar_amount21),
        dollar_amount20: Math.round(dollar_amount20),

        dollar_percent_total: percent_formatter(
          dollar_amount / regionalTotalsMap.dollar_amount
        ),
        dollar_percent_total21: percent_formatter(
          dollar_amount21 / regionalTotalsMap.dollar_amount21
        ),
        dollar_percent_total20: percent_formatter(
          dollar_amount20 / regionalTotalsMap.dollar_amount20
        ),

        percent_with_representation: percent_formatter(
          d3.sum(lawsuits, (d) => d.representation) / collectorCount
        ),
        percent_with_representation21: percent_formatter(
          d3.sum(lawsuits21, (d) => d.representation) / collectorCount21
        ),
        percent_with_representation20: percent_formatter(
          d3.sum(lawsuits20, (d) => d.representation) / collectorCount20
        ),

        percent_default_judgement: percent_formatter(
          d3.sum(lawsuits, (d) => d.default_judgement) / collectorCount
        ),
        percent_default_judgement21: percent_formatter(
          d3.sum(lawsuits21, (d) => d.default_judgement) / collectorCount21
        ),
        percent_default_judgement20: percent_formatter(
          d3.sum(lawsuits20, (d) => d.default_judgement) / collectorCount20
        ),

        percent_case_completed: percent_formatter(
          d3.sum(lawsuits, (d) => d.case_completed) / collectorCount
        ),
        percent_case_completed21: percent_formatter(
          d3.sum(lawsuits21, (d) => d.case_completed) / collectorCount21
        ),
        percent_case_completed20: percent_formatter(
          d3.sum(lawsuits20, (d) => d.case_completed) / collectorCount20
        ),
      };
    })
    .sort((a, b) => b.count - a.count);

  writeFile(jsonToCsv(processedLawsuits), fileName);
}

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
  // const csvData = await loadCsv("./static/data/raw_temp.csv", parser);
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
