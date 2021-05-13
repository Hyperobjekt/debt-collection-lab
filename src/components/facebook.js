import React from "react";
import { SocialButton } from "@hyperobjekt/material-ui-website";
import { useLocation } from "@reach/router";

const FacebookShare = (props) => {
  const location = useLocation();
  const encodedUrl = encodeURIComponent(location.href);
  const share = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  return (
    <SocialButton
      icon="facebook"
      target="_blank"
      rel="noreferrer"
      href={share}
      {...props}
    />
  );
};

FacebookShare.propTypes = {};

export default FacebookShare;
