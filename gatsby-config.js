const path = require("path");
const metadata = require("./config/metadata.json");

module.exports = {
  siteMetadata: metadata,
  plugins: [
    {
      resolve: `gatsby-theme-hypersite`,
      options: {
        contentPath: `content/pages`,
        assetPath: `content/assets`,
        layouts: {
          gallery: path.resolve("./src/arts-and-storytelling/layout.js"),
          about: path.resolve("./src/about-us/layout.js"),
        },
      },
    },
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        manualInit: true,
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./data/geojson`,
        typeName: `Geo`,
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        typekit: {
          id: "ycg5tjq",
        },
      },
    },
    "gatsby-plugin-styled-components",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    `gatsby-transformer-json`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
};
