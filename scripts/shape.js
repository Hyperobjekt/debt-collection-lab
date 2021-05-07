"use strict";

const d3 = require("d3");
const { loadCsv, writeFile } = require("./utils");

const DATE_FORMAT = d3.timeFormat("%m/%Y");
const MONTH_PARSE = d3.timeParse("%m/%Y");
const STATE_SELECTOR = (d) => d.id.substring(0, 2);
const COUNTY_SELECTOR = (d) => d.id.length === 11 && d.id.substring(0, 5);
const ZIP_SELECTOR = (d) => d.id.length === 7 && d.id;
const TRACT_SELECTOR = (d) => d.id.length === 11 && d.id;

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

function aggregateLawsuits(data) {
  // shape lawsuit history
  const lawsuitsByMonth = d3.group(data, (d) => d.date);
  const monthDates = Array.from(lawsuitsByMonth.keys()).sort((a, b) => a - b);
  const values = monthDates
    .map((v) => [DATE_FORMAT(v), lawsuitsByMonth.get(v).length].join(";"))
    .join("|");

  // shape top 5 debt collectors
  const lawsuitsByCollector = d3
    .groups(data, (d) =>
      d.plaintiff
        .toLowerCase()
        .replace(/"/g, "")
        .replace(/,/g, "")
        .replace("inc.", "inc")
        .replace("llc.", "llc")
        .replace(" assignee of credit one bank n.a.", "")
    )
    .map(([collector, lawsuits]) => [
      `'${collector}'`,
      lawsuits.length,
      d3.sum(lawsuits, (d) => d.amount),
    ]);

  const collectorTotal = lawsuitsByCollector.length;

  const topCollectors = lawsuitsByCollector
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((d) => d.join(";"))
    .join("|");

  // console.log(data.map((d) => d.default_judgement).join(","));

  return {
    id: data[0].id,
    name: getName(data[0].id, data[0].name),
    lawsuits: data.length,
    lawsuits_date: DATE_FORMAT(monthDates[monthDates.length - 1]),
    lawsuit_history: values,
    collectors: `"${topCollectors}"`,
    collector_total: collectorTotal,
    amount: d3.sum(data, (d) => d.amount),
    default_judgement: data.filter((d) => d.default_judgement === 1).length,
    no_rep_percent: data.filter((d) => !d.representation).length / data.length,
  };
}

/**
 * Aggregate data based on identifier
 * @param {*} id
 * @param {*} data
 */
function aggregateBySelector(data, selector = (d) => d.id) {
  const reshapedIdData = data
    .map((d) => ({ ...d, id: selector(d) }))
    .filter(Boolean);
  const groups = d3.groups(reshapedIdData, (d) => d.id);
  return groups.reduce((result, current) => {
    result.push(aggregateLawsuits(current[1]));
    return result;
  }, []);
}

const dateToMonthDate = (date, dateFormat = "%m/%d/%Y") => {
  const dateParse = d3.timeParse(dateFormat);
  return MONTH_PARSE(DATE_FORMAT(dateParse(date)));
};

const jsonToCsv = (jsonData) => {
  const headers = Object.keys(jsonData[0]).join(",");
  const data = jsonData.map((d) => Object.values(d).join(","));
  return [headers, ...data].join("\n");
};

async function shapeFullData() {
  const path = "./data/lawsuit_data.csv";
  const parser = (d) => {
    return {
      id: d.id,
      name: d.name,
      plaintiff: d.plaintiff,
      date: dateToMonthDate(d.date, "%m/%d/%Y"),
      default_judgement: Number(d.default_judgment),
      amount: Number(d.amount),
      representation: Number(d.has_representation),
    };
  };
  // Filter out NA data and FILTER OUT ZIP CODES!!
  // (id !== name, filters out zip codes, because zip code ids are the same as the name)
  // TODO: keep zip codes and shape them properly
  const data = loadCsv(path, parser)
    .filter((d) => d.id !== "NA")
    .map((d) => {
      // add state fips to zip code
      // TODO: need a way to determine state from zip code
      // - have Jeff add a column with state fips
      if (d.id === d.name) {
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
    ...aggregateBySelector(data, STATE_SELECTOR),
    ...aggregateBySelector(data, COUNTY_SELECTOR),
    ...aggregateBySelector(data, TRACT_SELECTOR),
    ...aggregateBySelector(data, ZIP_SELECTOR),
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
  await writeFile(jsonToCsv(output), "./static/data/lawsuits.csv");
  console.log("wrote file to ./static/data/lawsuits.csv");
}

shape();
