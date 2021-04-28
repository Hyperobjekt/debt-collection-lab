// Gets closest parent of element with selector
import WebMercatorViewport from "viewport-mercator-project";
import bbox from "@turf/bbox";

export const getFeatureGeometryType = (feature) => {
  if (!feature.geometry || !feature.geometry.type) return null;
  return feature.geometry.type;
};

export const getViewportForFeature = (feature, initialViewport) => {
  const type = getFeatureGeometryType(feature);
  if (!type) return {};
  if (type === "Point") {
    const [longitude, latitude] = feature.geometry.coordinates;
    return {
      latitude,
      longitude,
      zoom: 14,
    };
  }
  const featureBbox = bbox(feature);
  const bounds = [
    [featureBbox[0], featureBbox[1]],
    [featureBbox[2], featureBbox[3]],
  ];
  return getViewportForBounds(bounds, initialViewport);
};

export const getViewportForBounds = (bounds, baseViewport, options = {}) => {
  const width = baseViewport.width;
  const height = baseViewport.height;
  const padding = options.padding || 24;
  const vp = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(bounds, { padding });
  return {
    ...baseViewport,
    latitude: vp.latitude,
    longitude: vp.longitude,
    zoom: vp.zoom,
  };
};
