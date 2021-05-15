import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapboxLayer } from "@deck.gl/mapbox";
import { StaticMap, NavigationControl } from "react-map-gl";
import shallow from "zustand/shallow";
import DeckGLMap from "./DeckGLMap";
import { GeoJsonLayer } from "@deck.gl/layers";
import * as d3 from "d3";
import bbox from "@turf/bbox";
import useMapStore from "./hooks/useMapStore";
import { DEFAULT_VIEWPORT } from "./constants";
import { _MapContext as MapContext } from "react-map-gl";
import { formatInt, formatPercent } from "../utils";
import Tooltip from "./Tooltip";

const MAP_TOKEN =
  "pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw";
const MAP_STYLE = "mapbox://styles/hyperobjekt/cknuto9c60c0217qgff4tn4kb";

const getTooltipProps = ({ info, event }) => {
  const items = info.properties.demographics
    ? Object.values(info.properties.demographics)
        .sort((a, b) => b.value - a.value)
        .map(({ label, value }) => ({
          label,
          value: formatPercent(value),
          raw: value,
        }))
    : [];
  if (info.properties.medianHhi) {
    items.push({
      label: "Median Household Income",
      value: "$" + formatInt(info.properties.medianHhi),
    });
  }
  return {
    x: event.offsetCenter.x,
    y: event.offsetCenter.y,
    title: info.properties.name,
    subtitle: formatInt(info.properties.value) + " lawsuits",
    items: items,
  };
};

const ChoroplethMap = ({
  tooltip,
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
  const [loaded, setLoaded] = useState({ loaded: false, flown: false });
  const [setViewport, flyToBounds] = useMapStore(
    (state) => [state.setViewport, state.flyToBounds],
    shallow
  );
  const [selected, setSelected] = useState({
    info: null,
    event: { offsetCenter: { x: 0, y: 0 } },
  });

  const dataBounds = data ? bbox(data) : null;
  const initialViewport = data
    ? {
        latitude: (dataBounds[1] + dataBounds[3]) / 2,
        longitude: (dataBounds[0] + dataBounds[2]) / 2,
        zoom: 6,
      }
    : DEFAULT_VIEWPORT;

  const handleHover = ({ object }, event) => {
    if (object) {
      if (selected.info && selected.info !== object) {
        selected.info.properties.selected = false;
      }
      object.properties.selected = true;
    } else {
      if (selected) selected.info.properties.selected = false;
    }
    setSelected({ info: object, event: event });
  };

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
          getLineColor: (f) => {
            const color = d3
              .color(colorScale(f.properties.value))
              .darker(f.properties.selected ? 1 : 0.2);
            return [color.r, color.g, color.b];
          },
          getLineWidth: (f) => (f.properties.selected ? 3 : 1),
          lineWidthUnits: "pixels",
          lineWidthMinPixels: 1,
          pickable: true,
          updateTriggers: {
            getLineWidth: selected,
            getLineColor: selected,
          },
          onHover: handleHover,
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
    setLoaded({ loaded: true, flown: false });
    // eslint-disable-next-line
  }, []);

  const resetState = () => {
    setSelected(null);
  };

  // Fly to bounds on load
  useEffect(() => {
    if (loaded.loaded && !loaded.flown) {
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
      setLoaded({ loaded: true, flown: true });
    }
  }, [loaded, flyToBounds, setViewport, dataBounds]);

  return (
    <DeckGLMap
      ref={deckRef}
      layers={loaded && layers ? layers : []}
      initialViewport={initialViewport}
      onWebGLInitialized={setGLContext}
      ContextProvider={MapContext.Provider}
      controller={{ scrollZoom: false, doubleClickZoom: false }}
      glOptions={{
        /* To render vector tile polygons correctly */
        stencil: true,
      }}
      onMouseLeave={resetState}
    >
      <div
        style={{
          position: "absolute",
          right: 40,
          top: "50%",
          marginTop: -32,
          zIndex: 1,
        }}
      >
        <NavigationControl />
      </div>
      <StaticMap
        mapStyle={MAP_STYLE}
        preventStyleDiffing={true}
        mapboxApiAccessToken={MAP_TOKEN}
        gl={glContext}
        ref={mapRef}
        onLoad={onMapLoad}
      ></StaticMap>
      {selected.info && selected.event && (
        <Tooltip {...getTooltipProps(selected)} />
      )}
    </DeckGLMap>
  );
};

export default ChoroplethMap;
