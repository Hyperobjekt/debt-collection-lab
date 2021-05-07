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

There is a data preparation step that takes the source data and aggregates / transforms it into the format needed for the tracker.

This can be run with:

```
npm run build:data
```

## Lawsuit Tracker
