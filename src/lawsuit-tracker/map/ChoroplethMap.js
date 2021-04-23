import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
// import DeckGLMap, { useMapStore } from ".";
import { MapboxLayer } from "@deck.gl/mapbox";
import { NavigationControl, StaticMap } from "react-map-gl";
import shallow from "zustand/shallow";
import DeckGLMap from "./DeckGLMap";
import { GeoJsonLayer } from "@deck.gl/layers";
import * as d3 from "d3";
import bbox from "@turf/bbox";
import useMapStore from "./hooks/useMapStore";
import { DEFAULT_VIEWPORT } from "./constants";

const MAP_TOKEN =
  "pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw";
const MAP_STYLE = "mapbox://styles/hyperobjekt/cknuto9c60c0217qgff4tn4kb";

const ChoroplethMap = ({
  // hovered,
  colorScale,
  data,
  onHover,
  onClick,
  ...props
}) => {
  // DeckGL and mapbox will both draw into this WebGL context
  // required to interleave the shapes with mapbox layers
  const [glContext, setGLContext] = useState();
  const deckRef = useRef(null);
  const mapRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [setViewport, flyToBounds] = useMapStore(
    (state) => [state.setViewport, state.flyToBounds],
    shallow
  );

  const dataBounds = data ? bbox(data) : null;
  const initialViewport = data
    ? {
        latitude: (dataBounds[1] + dataBounds[3]) / 2,
        longitude: (dataBounds[0] + dataBounds[2]) / 2,
        zoom: 6,
      }
    : DEFAULT_VIEWPORT;

  const layers = data
    ? [
        new GeoJsonLayer({
          id: "shapes",
          data: data.features,
          opacity: 0.8,
          stroked: true,
          filled: true,
          getFillColor: (f) => {
            const color = d3.color(colorScale(f.properties.value));
            return [color.r, color.g, color.b];
          },
          getLineColor: [0, 0, 0, 100],
          pickable: true,
        }),
      ]
    : [];

  /**
   * On map load, insert the map layers in the correct order
   * so choropleths appear below outlines, roads, etc.
   */
  const onMapLoad = useCallback(() => {
    const map = mapRef.current.getMap();
    const deck = deckRef.current.deck;
    const addNestedLayers = (layers) => {
      if (!layers) return;
      if (layers && layers.hasOwnProperty("id"))
        map.addLayer(
          new MapboxLayer({ id: layers.id, deck }),
          "aeroway-polygon"
        );
      if (Array.isArray(layers))
        layers.forEach((layer) => addNestedLayers(layer));
    };
    addNestedLayers(layers);
    setLoaded(true);
    // eslint-disable-next-line
  }, []);

  // Fly to bounds on load
  useEffect(() => {
    if (loaded) {
      const map = mapRef.current.getMap();
      setViewport({
        width: map.getCanvas().offsetWidth,
        height: map.getCanvas().offsetHeight,
      });
      dataBounds &&
        flyToBounds([
          [dataBounds[0], dataBounds[1]],
          [dataBounds[2], dataBounds[3]],
        ]);
    }
  }, [loaded, flyToBounds, setViewport]);

  console.log(initialViewport);

  return (
    <DeckGLMap
      ref={deckRef}
      layers={loaded && layers ? layers : []}
      initialViewport={initialViewport}
      onWebGLInitialized={setGLContext}
      glOptions={{
        /* To render vector tile polygons correctly */
        stencil: true,
      }}
    >
      <StaticMap
        mapStyle={MAP_STYLE}
        preventStyleDiffing={true}
        mapboxApiAccessToken={MAP_TOKEN}
        gl={glContext}
        ref={mapRef}
        onLoad={onMapLoad}
      />
    </DeckGLMap>
  );
};

export default ChoroplethMap;
