const path = require("path");
const metadata = require("./config/metadata.json");

module.exports = {
  // use static file for metadata so netlify CMS can edit
  siteMetadata: metadata,
  plugins: [
    // configure base theme and custom templates
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
    // add CMS with manual init
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        manualInit: true,
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    // add geojson to graphql
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./data/geojson`,
      },
    },
    // add JSON content strings for lawsuit tracker to graphql
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./content/lawsuit-tracker`,
      },
    },
    // load typekit fonts
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        typekit: {
          id: "ycg5tjq",
        },
      },
    },
    // manifest configuration for home screen options
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
    // add google analytics
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-05J63KC61T"],
      },
    },
    {
      resolve: `gatsby-plugin-hotjar`,
      options: {
        id: 2409828,
        sv: 6,
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
