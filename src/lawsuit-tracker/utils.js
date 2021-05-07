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

export function shapeTracts(sourceData) {
  return sourceData.reduce((tracts, currentCounty) => {
    return [
      ...tracts,
      ...currentCounty.tracts.map((c) => ({
        ...c,
        county: currentCounty.name,
      })),
    ];
  }, []);
}

export function shapeZips(sourceData) {
  return sourceData.reduce((zips, currentState) => {
    return [
      ...zips,
      ...currentState.zips.map((c) => ({
        ...c,
        state: currentState.name,
      })),
    ];
  }, []);
}

export const getTrackerUrl = (data) => {
  let result = "/lawsuit-tracker/";
  if (data.state) result += slugify(data.state) + "/";
  result += slugify(data.name);
  return result;
};

export const getEarliestDate = (data) => {
  return data.reduce((start, current) => {
    // ignore invalid dates
    if (current.month.indexOf("1969") > -1) return start;
    const d = parseMonthYear(current.month);
    return +d < +start ? d : start;
  }, new Date(8640000000000000));
};

export const getLatestDate = (data) => {
  return data.reduce((end, current) => {
    // ignore invalid dates
    if (current.month.indexOf("1969") > -1) return end;
    const d = parseMonthYear(current.month);
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
    if (currentState.name === "Texas")
      return total + d3.sum(currentState.counties, (d) => d.lawsuits);
    return total + currentState.lawsuits;
  }, 0);
  return { stateCount, countyCount, lawsuitTotal };
};

export const getLocationHeroData = (data) => {
  return {
    name: data.name,
    totalCount: data.lawsuits,
    percentWithoutRep: data.no_rep_percent,
    percentDefault: data.default_judgement / data.lawsuits,
    dateRange: getDateRange([data]),
  };
};

export const getLawsuitChartData = (data) => {
  // shape 2020 data
  const g2020 = data.lawsuit_history.map((d) => ({
    group: formatYear(parseMonthYear(d.month)),
    x: formatShortMonth(parseMonthYear(d.month)),
    y: d.lawsuits,
  }));
  // generate sample years bases on 2020 values
  const g2019 = g2020.map((d) => ({
    group: "2019",
    x: d.x,
    y: (Math.random() * 0.5 + 0.75) * d.y,
  }));
  const g2018 = g2020.map((d) => ({
    group: "2018",
    x: d.x,
    y: (Math.random() * 0.5 + 0.75) * d.y,
  }));
  // only jan / feb / march for 2021
  const g2021 = g2020
    .map((d) => ({
      group: "2021",
      x: d.x,
      y:
        ["Jan", "Feb", "Mar"].indexOf(d.x) > -1
          ? (Math.random() * 0.5 + 0.75) * d.y
          : 0,
    }))
    .filter((d) => d.y > 0);
  // one big array for all chart data
  const chartData = [...g2018, ...g2019, ...g2020, ...g2021];
  // get the average value for each month
  const monthlyAverages = d3
    .groups(chartData, (d) => d.x)
    .map((d) => [d[0], d3.sum(d[1], (v) => v.y / d[1].length)]);
  // pull the month with the highest average
  const topMonth = monthlyAverages.sort((a, b) => b[1] - a[1])[0];
  // get the average yearly filings
  const avgYearly = d3.sum(monthlyAverages, (d) => d[1]);
  // calculate the % of the top month's lawsuits of the yearly average
  const topMonthPercent = topMonth[1] / avgYearly;
  // format the top month name as
  const topMonthName = d3.timeFormat("%B")(
    d3.timeParse("%b/%Y")(`${topMonth[0]}/2020`)
  );
  return {
    chartData,
    avgYearly,
    topMonthName,
    topMonthPercent,
  };
};

export const getLawsuitMapData = (data, geojson, region) => {
  const childData = data[region];
  const features = geojson.features
    .map((f) => {
      const match = childData.find((d) => d.geoid === f.properties.GEOID);
      return match
        ? {
            ...f,
            properties: {
              ...f.properties,
              value: match.lawsuits,
            },
          }
        : null;
    })
    .filter((v) => !!v);
  return { type: "FeatureCollection", features };
};

const joinDemographicsWithData = (data, demographics, region) => {
  return demographics
    .map((dem) => {
      const match = data[region].find((tract) => tract.geoid === dem.geoid);
      return match
        ? {
            ...dem,
            ...match,
          }
        : null;
    })
    .filter(Boolean);
};

/**
 * Step 1: join lawsuit and demographic data
 * Step 2: group joined data by racial majority
 * Step 3: sum all lawsuits for each racial majority entry by month
 * @param {*} data
 * @param {*} demographics
 * @returns
 */
export const getDemographicChartData = (data, demographics, region="tracts") => {
  // Step 1: join lawsuit and demographic data
  const joined = joinDemographicsWithData(data, demographics, region);

  // Step 2: group joined data by racial majority
  const grouped = d3.group(joined, (d) => d.majority);
  const counts = Array.from(grouped.entries()).map(([g, entries]) => ({
    group: g,
    tractCount: entries.length,
    tractPercent: entries.length / joined.length,
    lawsuitCount: d3.sum(entries, (d) => d.lawsuits),
    lawsuitPercent: d3.sum(entries, (d) => d.lawsuits) / data.lawsuits,
  }));

  // Step 3: aggregate all lawsuits by group, by month
  const summed = Array.from(grouped.entries())
    .map(([group, groupData]) => {
      const byMonth = groupData.reduce((monthObj, entry) => {
        const monthValues = entry.lawsuit_history;
        monthValues.forEach((data) => {
          if (!monthObj.hasOwnProperty(data.month)) monthObj[data.month] = 0;
          monthObj[data.month] = monthObj[data.month] + data.lawsuits;
        });
        return monthObj;
      }, {});
      return [group, Object.entries(byMonth)];
    })
    .map(([group, history]) => {
      const withPercent = history.map(([month, lawsuits]) => {
        // pull the month total from lawsuit history
        const monthTotal = data.lawsuit_history.find(
          (totalHistory) => totalHistory.month === month
        );
        // pull group percent from counts
        const groupPercent = counts.find((c) => c.group === group).tractPercent;
        const proportionalCount = groupPercent * monthTotal.lawsuits;
        return {
          month,
          lawsuits,
          lawsuitPercent: lawsuits / monthTotal.lawsuits,
          proportionalCountDiff: lawsuits - proportionalCount,
          proportionalPercentDiff: lawsuits / proportionalCount - 1,
        };
      });
      return [group, withPercent];
    });

  // Step 4: flatten summed array into chart format
  const chart = summed
    .reduce((flattened, [group, groupData]) => {
      groupData.forEach(
        ({
          month,
          lawsuits,
          lawsuitPercent,
          proportionalCountDiff,
          proportionalPercentDiff,
        }) => {
          flattened.push({
            group,
            x: parseMonthYear(month),
            y: proportionalCountDiff,
            data: {
              month,
              lawsuits,
              lawsuitPercent,
              proportionalCountDiff,
              proportionalPercentDiff,
            },
          });
        }
      );
      return flattened;
    }, [])
    .sort((a, b) => a.group.localeCompare(b.group))
    .sort((a, b) => a.x - b.x);

  return {
    chartData: chart,
    tractCountByMajority: counts,
    totalLawsuits: data.lawsuits,
  };
};

export const getTopCollectorsData = (data) => {
  const topLawsuits = d3.sum(data.top_collectors, (d) => d.lawsuits);
  const topPercent = topLawsuits / data.lawsuits;
  const chartData = data.top_collectors.map((d) => ({
    ...d,
    group: d.collector,
    value: d.lawsuits / data.lawsuits,
  }));
  chartData.push({
    group: "Other",
    value: (data.lawsuits - topLawsuits) / data.lawsuits,
    lawsuits: data.lawsuits - topLawsuits,
  });
  return {
    total: data.lawsuits,
    collectors: data.top_collectors,
    topLawsuits,
    topPercent,
    collector_total: data.collector_total,
    name: data.name,
    chartData,
  };
};

export const parseMonthYear = d3.timeParse("%m/%Y");
export const formatPercent = d3.format(".1%");
export const formatInt = d3.format(",d");
export const formatYear = d3.timeFormat("%Y");
export const formatShortMonth = d3.timeFormat("%b");
export const formatMonthYear = d3.timeFormat("%B %Y");
export const formatShortMonthYear = d3.timeFormat("%b '%y");
