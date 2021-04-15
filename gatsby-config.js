const metadata = require("./config/metadata.json");

const siteUrl = `https://debtcollectionlab.org`;

module.exports = {
  siteMetadata: {
    siteUrl,
    canonicalUrl: siteUrl,
    ...metadata,
  },
  plugins: [
    "gatsby-plugin-netlify-cms",
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-KCG3842",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: require.resolve("./src/layouts/default.js"),
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/content/pages`,
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-plugin-page-creator",
      options: {
        path: `${__dirname}/content/pages`,
      },
    },
    "gatsby-theme-material-ui",
  ],
};
