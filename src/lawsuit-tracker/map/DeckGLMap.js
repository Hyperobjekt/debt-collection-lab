import React, { useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { useMapState } from "./hooks/useMapStore";
import "mapbox-gl/dist/mapbox-gl.css";

// import mapboxgl from "mapbox-gl";

// // prevents failing build because of mapbox: https://github.com/mapbox/mapbox-gl-js/issues/10173
// // @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
// mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const DeckGLMap = React.forwardRef(
  ({ children, initialViewport, bounds, ...props }, ref) => {
    const [viewport, setViewport, setDefaultViewport] = useMapState(
      "viewport",
      "setViewport",
      "setDefaultViewport"
    );

    // set the initial viewport
    useEffect(() => {
      setViewport(initialViewport);
      // eslint-disable-next-line
    }, []);

    // // update bounds in the store if they change
    // useEffect(() => {
    //   bounds && setBounds(bounds);
    // }, [bounds, setBounds]);

    // update default viewport on set
    useEffect(() => {
      initialViewport && setDefaultViewport(initialViewport);
    }, [initialViewport, setDefaultViewport]);

    // update the viewport in state on change
    const handleViewportChange = (e) => {
      return setViewport(e.viewState);
    };

    return (
      <DeckGL
        ref={ref}
        viewState={viewport}
        onViewStateChange={handleViewportChange}
        controller={true}
        {...props}
      >
        {children}
      </DeckGL>
    );
  }
);

export default DeckGLMap;
