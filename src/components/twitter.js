import React from "react";
import { SocialButton } from "@hyperobjekt/material-ui-website";
import { useLocation } from "@reach/router";

const TwitterShare = (props) => {
  const location = useLocation();
  const encodedUrl = encodeURIComponent(location.href);
  const share = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
  return (
    <SocialButton
      icon="twitter"
      target="_blank"
      rel="noreferrer"
      href={share}
      {...props}
    />
  );
};

TwitterShare.propTypes = {};

export default TwitterShare;
