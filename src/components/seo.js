import * as React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import defaultMetaImage from "../../static/images/metaImage.png";
import { useSiteMetadata } from "../hooks/use-site-metadata";

function SEO({
  siteMetadata: seo,
  metaImage,
  isBlogPost,
  frontmatter = {},
  title = frontmatter.title || seo.title,
  description = frontmatter.description || seo.description,
  image = `${seo.canonicalUrl}${metaImage || defaultMetaImage}`,
  url = frontmatter.slug
    ? `${seo.canonicalUrl}${frontmatter.slug}`
    : seo.canonicalUrl,
}) {
  return (
    <Helmet>
      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      {isBlogPost ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={seo.social.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

function SEOWithQuery(props) {
  const siteMetadata = useSiteMetadata();
  return <SEO siteMetadata={siteMetadata} {...props} />;
}

SEOWithQuery.propTypes = {
  isBlogPost: PropTypes.bool,
  metaImage: PropTypes.string,
};

SEOWithQuery.defaultProps = {
  isBlogPost: false,
  metaImage: null,
};

export default SEOWithQuery;
