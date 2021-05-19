# Debt Collection Lab

## Getting Started

built with:

- node version: 15+
- gatsby: 3.2+
- material-ui +4.11

to run locally, clone the repository and install dependencies with

```
npm install
```

start in development mode with

```
npm run develop
```

## Gatsby Configuration

This site is based off of the `gatsby-theme-hypersite` theme. Which provides:

- Base website components (header, footer, block, hero, navigation)
- MDX page creation with SEO and images frontmatter

See [gatsby-theme-hypersite](https://github.com/Hyperobjekt/gatsby-themes/tree/main/themes/gatsby-theme-hypersite) and [gatsby-starter-hypersite](https://github.com/Hyperobjekt/gatsby-themes/tree/main/starters/gatsby-starter-hypersite) for more info about customizing the theme.

## Data

### Preliminary Shaping / Aggregation

There is a data preparation step that performs the following actions:

- loads the source lawsuit data (`/data/lawsuits_data.csv`)
  - TODO: pull from S3 source
- aggregates tract level data to counties and states
- aggregates zip code level data to states
- shapes data into format needed for tracker
- writes `lawsuits.csv` to `/static/data/lawsuits.csv`

The script that performs this action is in `/scripts/shape.js` and can be run with:

```
npm run build:data
```

### Creating Source Nodes

Source nodes are created in Gatsby from source data in `gatsby-node.js`. The following nodes are created:

- `allStates`: created from `/static/data/lawsuits.csv` and `/static/data/demographics.csv`, contains all state level debt collection data
- `allCounties`: created from `/static/data/lawsuits.csv` and `/static/data/demographics.csv`, contains all county level debt collection data
  - TODO: pull from S3 source

### GeoJSON Source Nodes

GeoJSON for maps is sourced using `gatsby-source-filesystem` configuration in `gatsby-config.js`. Each GeoJSON file is a FeatureCollection with a few modifications:

- there is a `name` property at the root level of the FeatureCollection that has the state name (used to query state specific GeoJson)
- there is a `region` property at the root level of the FeatureCollection that has the region type (e.g. "counties", "zips", "tracts")
- GeoJson features must be of `MultiPolygon` type in order for graphql to load them correctly.

> _HACK_: if your GeoJson has `Polygon` features, you'll need to convert these to `MultiPolygon` features
> TODO: find a way to allow multiple feature types (might need to create a [custom graphql schema](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/))

## Page Creation

### Lawsuit Tracker

All pages in the lawsuit tracker (index, state pages, county pages) are created in `gatsby-node.js` based on the lawsuits data in `/static/data/lawsuits.js`. See `/src/lawsuit-tracker` for tracker related components including:

- layouts
- charts
- maps
- tables

State and county pages have dynamic social images that can be created at build time. To re-build these images, set the `BUILD_IMAGES` env var to `1` or run `npm run build:all`.

> Note: do not generate the images in a CI environment as it will not have fonts available. Run the image generation on a system that has Helvetica Neue.

### Other Pages and Custom GraphQL Queries

All other pages are created based on the MDX files in `/content/pages`. Functionality for creating these pages is part of `gatsby-theme-hypercore`.

Some pages (about us, arts and storytelling) have custom frontmatter that is provided to the page through a custom page template.

See:

- `./src/about-us/layout.js`
- `./src/arts-and-storytelling/layout.js`

These custom page templates are provided to the hypersite theme in `gatsby-config.js`

## Content Management

Content is managed using `netlify-cms`, using manual initialization in `/src/cms/cms.js`. All pages and partials for field definitions can be found in the `/src/cms/` folder.
