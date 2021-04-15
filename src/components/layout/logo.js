import React from "react";
import { Branding } from "@hyperobjekt/material-ui-website";
import { useSiteMetadata } from "../../hooks/use-site-metadata";

const Logo = (props) => {
  const siteMetadata = useSiteMetadata();
  return (
    <Branding {...props}>
      <img src={siteMetadata.logo} alt={siteMetadata.title} />
    </Branding>
  );
};

export default Logo;
