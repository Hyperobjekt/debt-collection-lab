import React from "react";
import { useLocation } from "@reach/router";

/**
 * A wrapper component that only renders children if a given flag is
 * present in URL params
 */
const FutureRelease = ({ release, children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shouldRender =
    searchParams.has("release") && searchParams.get("release") === release;
  return shouldRender ? <>{children}</> : null;
};

export default FutureRelease;
