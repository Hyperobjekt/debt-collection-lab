import * as React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { useSiteMetadata } from "../hooks/use-site-metadata";
import * as _pick from "lodash.pick"
import { SEO_KEYS } from "../constants";

export function Seo({
  isBlogPost,
  title,
  description,
  keywords,
  image,
  url,
  twitter,
}) {
  return (
    <Helmet>
      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      { image && <meta name="image" content={image} /> }
      { keywords && <meta name="keywords" content={keywords} />}

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      {isBlogPost ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      { image && <meta property="og:image" content={image} /> }

      {/* Twitter Card tags */}
      { image && <meta name="twitter:card" content="summary_large_image" /> }
      {twitter && <meta name="twitter:creator" content={twitter} /> }
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      { image && <meta name="twitter:image" content={image} /> }
    </Helmet>
  );
}

function SeoWithDefaults(props) {
  const siteMetadata = useSiteMetadata();
  const defaultProps = _pick(siteMetadata, SEO_KEYS)
  const seoProps = {
    ...defaultProps,
    twitter: siteMetadata.social.twitter,
    ...props
  }
  return <Seo {...seoProps} />;
}

SeoWithDefaults.propTypes = {
  isBlogPost: PropTypes.bool,
  metaImage: PropTypes.string,
};

SeoWithDefaults.defaultProps = {
  isBlogPost: false,
  metaImage: null,
};

export default SeoWithDefaults;
