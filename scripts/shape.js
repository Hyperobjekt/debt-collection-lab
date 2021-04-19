"use strict";

const d3 = require("d3");
const { loadCsv, writeFile } = require("./utils");

const DATE_PARSE = d3.timeParse("%m/%d/%Y");
const DATE_FORMAT = d3.timeFormat("%m/%Y");
const MONTH_PARSE = d3.timeParse("%m/%Y");
const STATE_SELECTOR = (d) => d.id.substring(0, 2);
const COUNTY_SELECTOR = (d) => d.id.substring(0, 5);
const TRACT_SELECTOR = (d) => d.id;

function getName(id, name) {
  if (id.length === 2) return name.split(",").pop().trim();
  if (id.length === 5) return name.split(",")[1].trim();
  return name.split(",")[0].trim();
}

function aggregateLawsuits(data) {
  // group by month
  const lawsuitsByMonth = d3.group(data, (d) => d.date);
  const monthDates = Array.from(lawsuitsByMonth.keys()).sort((a, b) => a - b);
  const values = monthDates
    .map((v) => [DATE_FORMAT(v), lawsuitsByMonth.get(v).length].join(";"))
    .join("|");

  return {
    id: data[0].id,
    name: getName(data[0].id, data[0].name),
    lawsuits: data.length,
    lawsuits_date: DATE_FORMAT(monthDates[monthDates.length - 1]),
    lawsuit_history: values,
    default_judgement: data.filter((d) => d.decided && !d.representation)
      .length,
    no_rep_percent: data.filter((d) => !d.representation).length / data.length,
  };
}

function aggregateCollectors(data) {
  const byCollector = data.group(data, (d) => d.plaintiff);
  return {
    location_id: data[0].id,
    location_name: getName(data[0].id, data[0].name),
    lawsuits: data.length,
  };
}

/**
 * Aggregate data based on identifier
 * @param {*} id
 * @param {*} data
 */
function aggregateBySelector(data, selector = (d) => d.id) {
  const reshapedIdData = data.map((d) => ({ ...d, id: selector(d) }));
  const groups = d3.groups(reshapedIdData, (d) => d.id);
  return groups.reduce((result, current) => {
    result.push(aggregateLawsuits(current[1]));
    return result;
  }, []);
}

function aggregateByCollector(data, selector = (d) => d.id) {
  const reshapedIdData = data.map((d) => ({ ...d, id: selector(d) }));
  const groups = d3.groups(reshapedIdData, (d) => d.id);
  return groups.reduce((result, current) => {
    result.push(aggregateCollectors(current[1]));
    return result;
  }, []);
}



const dateToMonthDate = (date) => MONTH_PARSE(DATE_FORMAT(DATE_PARSE(date)));

const jsonToCsv = (jsonData) => {
  const headers = Object.keys(jsonData[0]).join(",");
  const data = jsonData.map((d) => Object.values(d).join(","));
  return [headers, ...data].join("\n");
};

async function shapeIndiana() {
  const path = "./data/indiana.csv";
  const parser = (d) => ({
    id: d.id,
    name: d.name,
    plaintiff: d.plaintiff,
    decided: d.status.toLowerCase() === "decided",
    date: dateToMonthDate(d.date),
    representation: d.attorney.toLowerCase() !== "na",
  });

  const data = loadCsv(path, parser);
  // await writeDataFile(JSON.stringify(data, null, 2), "./output/parsed.json");
  const debtData = [
    ...aggregateBySelector(data, STATE_SELECTOR),
    ...aggregateBySelector(data, COUNTY_SELECTOR),
    ...aggregateBySelector(data, TRACT_SELECTOR),
  ];
  // await writeDataFile(JSON.stringify(shapedData, null, 2), "./output/tmp.json");
  await writeFile(jsonToCsv(debtData), "./static/data/lawsuits.csv");
  console.log("written!");
}

shapeIndiana();
