import create from "zustand";
import { DEFAULT_VIEWPORT, DEFAULT_FLIGHT_PROPS } from "../constants";
import shallow from "zustand/shallow";
import { getViewportForBounds, getViewportForFeature } from "../selectors";

/**
 * Returns a viewport that fits within the provided bounds
 * @param {*} viewport
 * @param {*} bounds
 */
const keepBound = (viewport, bounds) => {
  if (!bounds) return viewport;
  const extents = {
    latitude: [bounds[1], bounds[3]],
    longitude: [bounds[0], bounds[2]],
    zoom: [4, 16],
  };
  return {
    ...viewport,
    ...Object.keys(extents).reduce((obj, key) => {
      const value = viewport[key];
      const [MIN, MAX] = extents[key];
      obj[key] = Math.min(Math.max(value, MIN), MAX);
      return obj;
    }, {}),
  };
};

const useMapStore = create((set, get) => ({
  /** state containing the current map instance (for use with [MapboxGL API](https://docs.mapbox.com/mapbox-gl-js/api/)) */
  map: null,
  setMap: (map) => set({ map }),
  /** state for if the map has loaded on the page */
  loaded: false,
  setLoaded: (loaded) => set({ loaded }),
  /** state for if the map is currently loading or not */
  loading: true,
  setLoading: (loading) => set({ loading }),
  /** state for map viewport */
  viewport: DEFAULT_VIEWPORT,
  setViewport: (viewport, extra = {}) => {
    set((state) => {
      const bounds = state.bounds;
      const newViewport = {
        ...state.viewport,
        ...viewport,
        ...extra,
      };
      const boundViewport = keepBound(newViewport, bounds);
      return { viewport: boundViewport };
    });
  },
  /** default viewport state */
  defaultViewport: { ...DEFAULT_VIEWPORT },
  setDefaultViewport: (defaultViewport) => set({ defaultViewport }),
  /** bounding viewports */
  bounds: null,
  setBounds: (bounds) => set({ bounds }),
  /** state helper function to fly to a feature */
  flyToFeature: (feature) => {
    const viewport = {
      ...getViewportForFeature(feature, get().viewport),
      ...DEFAULT_FLIGHT_PROPS,
    };
    set({ viewport });
  },
  /** state helper function to fly to bounds */
  flyToBounds: (bounds) => {
    set((state) => ({
      viewport: {
        ...getViewportForBounds(bounds, state.viewport),
        ...DEFAULT_FLIGHT_PROPS,
      },
    }));
  },
  /** state helper function to fly to lat lon pair */
  flyToLatLon: (lat, lon, zoom) => {
    set((state) => ({
      viewport: {
        ...state.viewport,
        latitude: lat,
        longitude: lon,
        zoom: zoom || state.zoom,
        ...DEFAULT_FLIGHT_PROPS,
      },
    }));
  },
  /** state helper function to fly to reset boundary */
  flyToReset: () => {
    set((state) => {
      const newViewport = {
        ...state.viewport,
        ...state.resetViewport,
        ...DEFAULT_FLIGHT_PROPS,
      };
      return { viewport: newViewport };
    });
  },
}));

export default useMapStore;

/**
 * Pulls keys out of the map state with shallow comparison
 * @param  {Array<string>} keys array of state keys to use
 */
export const useMapState = (...keys) => {
  return useMapStore((state) => keys.map((k) => state[k]), shallow);
};
