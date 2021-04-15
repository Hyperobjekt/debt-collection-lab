import React from "react";
import Providers from "./src/providers";

/**
 * Wrap providers for site (MDXProvider + SiteContext)
 */
export const wrapRootElement = ({ element }) => (
  <Providers>{element}</Providers>
);

/**
 * Set focus on skip nav link when route changes
 */
export const onRouteUpdate = ({ location, prevLocation }) => {
  if (prevLocation !== null) {
    const skipLink = document.querySelector("#reach-skip-nav")
    if (skipLink) {
      skipLink.focus()
    }
  }
}