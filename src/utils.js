
/**
 * Gets a nested object property from the source object
 * @param {*} obj 
 * @param {*} path 
 */
export const getObjectProperty = (source, path) => {
  const keys = path.split('.');
  return keys.reduce((result, key) => {
    return result && typeof result === "object" ? result['key'] : null
  }, source)
}