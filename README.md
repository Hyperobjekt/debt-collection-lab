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

## Themes

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

- `allStates`: created from `/static/data/lawsuits.csv`, contains all state level debt collection data
- `allCounties`: created from `/static/data/lawsuits.csv`, contains all county level debt collection data
- `allDemographics`: created from `/static/data/demographics.csv`, contains all demographics data for census tracts and zip codes
  - TODO: pull from S3 source

### GeoJSON Source Nodes

GeoJSON for maps is sourced using `gatsby-source-filesystem` configuration in `gatsby-config.js`. Each GeoJSON file is a FeatureCollection with a few modifications:

- there is a `name` property at the root level of the FeatureCollection that has the state name (used to query state specific GeoJson)
- there is a `region` property at the root level of the FeatureCollection that has the region type (e.g. "counties", "zips", "tracts")
- GeoJson features must be of `MultiPolygon` type in order for graphql to load them correctly.

> _HACK_: if your GeoJson has `Polygon` features, you'll need to convert these to `MultiPolygon`  
TODO: find a way to allow multiple feature types (might need to create a [custom graphql schema](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/))  
for now, you can use a regex find (`"type":"MultiPolygon","coordinates":[[$1]]`) / replace (`"type":"MultiPolygon","coordinates":[[$1]]`) [in VS Code](https://docs.microsoft.com/en-us/visualstudio/ide/using-regular-expressions-in-visual-studio?view=vs-2019) to convert polygons to multipolygons

## Page Creation

### Lawsuit Tracker

All pages in the lawsuit tracker (index, state pages, county pages) are created in `gatsby-node.js` based on the lawsuits data in `/static/data/lawsuits.js`. See `/src/lawsuit-tracker` for tracker related components including:

- layouts
- charts
- maps
- tables

### Other Pages

All other pages are created based on the MDX files in `/content/pages`. Functionality for creating these pages is part of `gatsby-theme-hypercore`.

## Content Management

Content is managed using `netlify-cms`, using manual initialization in `/src/cms/cms.js`. All pages and partials for field definitions can be found in the `/src/cms/` folder.
