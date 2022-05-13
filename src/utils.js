/**
 * Gets a nested object property from the source object
 * @param {*} obj
 * @param {*} path
 */
export const getObjectProperty = (source, path) => {
  const keys = path.split(".");
  return keys.reduce((result, key) => {
    return result && typeof result === "object" ? result["key"] : null;
  }, source);
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const getCsvFileName = (name, stateName) => {
  // stateName only added for counties
  const fileName =
    !stateName || slugify(stateName) === slugify(name)
      ? slugify(name)
      : slugify(`${stateName}-${name}`);
  return `/data/${fileName}.csv`;
};