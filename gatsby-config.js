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
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./content/lawsuit-tracker`,
        typeName: `Tracker`,
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
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Debt Collection Lab`,
        short_name: `Debt Collection Lab`,
        start_url: `/`,
        background_color: `#181817`,
        theme_color: `#EA4A2E`,
        display: `standalone`,
        icon: "content/pages/images/favicon-260.png",
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
