import * as d3 from "d3";

const AVAILABLE = [
  "Connecticut",
  "Indiana",
  "Missouri",
  "North Dakota",
  "Texas",
];

/**
 * Creates a comparator for sorting an object property containing numbers
 * @param {*} key
 * @param {*} ascending
 * @returns
 */
const sortNumbers = (key, ascending) => (a, b) =>
  ascending ? a[key] - b[key] : b[key] - a[key];

/**
 * Creates a comparator for sorting an object property containing text
 * @param {*} key
 * @param {*} ascending
 * @returns
 */
const sortText = (key, ascending) => (a, b) => {
  var nameA = a[key].toUpperCase(); // ignore upper and lowercase
  var nameB = b[key].toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return ascending ? -1 : 1;
  }
  if (nameA > nameB) {
    return ascending ? 1 : -1;
  }

  // names must be equal
  return 0;
};

/**
 * Sorts an array of objects by the given key and direction
 * @param {*} data
 * @param {*} key
 * @param {*} ascending
 * @returns
 */
export function sortData(data, key, ascending) {
  if (!key) return data;
  // console.log("sorting", key, ascending === true ? "ascending" : "descending");
  // sort all subrows
  const result = data.map((d) => {
    const modifiers = {};
    if (d.subRows && d.subRows.length > 0) {
      modifiers.subRows = sortData(d.subRows, key, ascending);
    }
    return {
      ...d,
      ...modifiers,
    };
  });
  // sort top level
  const sorter = key === "name" ? sortText : sortNumbers;
  result.sort(sorter(key, ascending));
  return result;
}

/**
 * Filters data entries so that only entries matching the provided
 * text are returned
 * @param {*} data
 * @param {*} text
 * @returns
 */
export const applyFilter = (data, text) => {
  if (!text) return data;
  const result = data.map((d) => {
    const modifiers = {};
    if (d.subRows && d.subRows.length > 0) {
      modifiers.subRows = applyFilter(d.subRows, text);
    }
    return {
      ...d,
      ...modifiers,
    };
  });
  return result.filter(
    (d) =>
      d.name.toUpperCase().indexOf(text.toUpperCase()) > -1 ||
      (d.subRows && d.subRows.length)
  );
};

export function shapeStatesCounties(sourceData) {
  const data = shapeCounties(sourceData);
  return d3
    .groups(data, (d) => d.state)
    .map((d) => ({
      id: d[0],
      name: d[0],
      lawsuits: d[0] === "Texas" ? null : d3.sum(d[1], (d) => d.lawsuits),
      default_judgements:
        d[0] === "Texas" ? null : d3.sum(d[1], (d) => d.default_judgements),
      subRows:
        d[0] === "Texas"
          ? d[1].filter((c) => c.name === "Harris County")
          : d[1],
      expanded: true,
    }))
    .filter((d) => AVAILABLE.indexOf(d.name) > -1);
}

export function shapeStates(sourceData) {
  const data = shapeCounties(sourceData);
  return d3
    .groups(data, (d) => d.state)
    .map((d) => ({
      id: d[0],
      name: d[0],
      lawsuits: d[0] === "Texas" ? null : d3.sum(d[1], (d) => d.lawsuits),
      default_judgements:
        d[0] === "Texas" ? null : d3.sum(d[1], (d) => d.default_judgements),
    }));
}

export function shapeCounties(sourceData) {
  return sourceData
    .map((c) => ({
      id: c.fips,
      name: c.county + " County",
      state: c.state,
      date: c.date,
      lawsuits: Number(c.confirmed_cases),
      default_judgements: Math.floor(
        Number(c.confirmed_cases) * (Math.random() * 0.3 + 0.7)
      ),
    }))
    .filter((d) => AVAILABLE.indexOf(d.state) > -1)
    .filter((d) => {
      if (d.state !== "Texas") return true;
      if (d.name === "Harris County") return true;
      return false;
    });
}

export async function makeData() {
  return await d3.csv(
    "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv"
  );
}
