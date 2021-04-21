import { slugify } from "../utils";
import * as d3 from "d3";

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
  return sourceData.map((d) => ({
    ...d,
    subRows: d.counties,
    expanded: true,
  }));
}

export function shapeStates(sourceData) {
  return sourceData;
}

export function shapeCounties(sourceData) {
  return sourceData.reduce((counties, currentState) => {
    return [
      ...counties,
      ...currentState.counties.map((c) => ({ ...c, state: currentState.name })),
    ];
  }, []);
}

export const getTrackerUrl = (data) => {
  let result = "/lawsuit-tracker/";
  if (data.state) result += slugify(data.state) + "/";
  result += slugify(data.name);
  return result;
};

const monthParse = d3.timeParse("%m/%Y");

export const getEarliestDate = (data) => {
  return data.reduce((start, current) => {
    // ignore invalid dates
    if (current.month.indexOf("1969") > -1) return start;
    const d = monthParse(current.month);
    return +d < +start ? d : start;
  }, new Date(8640000000000000));
};

export const getLatestDate = (data) => {
  return data.reduce((end, current) => {
    // ignore invalid dates
    if (current.month.indexOf("1969") > -1) return end;
    const d = monthParse(current.month);
    return +d > +end ? d : end;
  }, new Date(-8640000000000000));
};

export const getDateRange = (data) => {
  // earliest date in lawsuit history
  const startDate = data.reduce((start, currentState) => {
    const d = getEarliestDate(currentState.lawsuit_history);
    return +d < +start ? d : start;
  }, new Date(8640000000000000));
  // latest date in lawsuit history
  const endDate = data.reduce((end, currentState) => {
    const d = getLatestDate(currentState.lawsuit_history);
    return +d > +end ? d : end;
  }, new Date(-8640000000000000));
  return [startDate, endDate];
};

export const getTotals = (data) => {
  // number of states in the data
  const stateCount = data.length;
  // number of counties in the data
  const countyCount = data.reduce((total, currentState) => {
    return total + currentState.counties.length;
  }, 0);
  // total number of lawsuits across states
  const lawsuitTotal = data.reduce((total, currentState) => {
    return total + currentState.lawsuits;
  }, 0);
  return { stateCount, countyCount, lawsuitTotal };
};

export const lawsuitHistoryToXY = (data) => {
  return data.map((d) => ({ x: d.month, y: d.lawsuits }));
};
