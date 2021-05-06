import React from "react";
import clsx from "clsx";
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby-material-ui-components";
import HomeIcon from "@material-ui/icons/Home";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { List, ListItem, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { GatsbyLink } from "gatsby-theme-material-ui";
import { useLocation } from "@reach/router"
import { getTrackerUrl } from "../lawsuit-tracker/utils";
// import Dropdown from "./dropdown"

const styles = (theme) => ({
  root: {
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    color: "#fff",
    "&:hover $childItems, &:focus $childItems": {
      display: "block",
    },
  },
  link: {
    display: "block",
    padding: theme.spacing(1),
  },
  home: {
    display: "block",
    fontSize: 20,
    marginLeft: theme.spacing(-1),
  },
  separator: {
    fontSize: 12,
  },
  dropdown: {
    fontSize: 20,
  },
  childItems: {
    display: "none",
    position: "absolute",
    top: 36,
    width: 300,
    maxHeight: "80vh",
    overflow: "auto",
    listStyle: "none",
    padding: 0,
    margin: 0,
    color: "#fff",
    background: theme.palette.secondary.main,
  },
});

const Breadcrumb = ({
  classes,
  className,
  links,
  data,
  Home = HomeIcon,
  Separator = ChevronRight,
  DropdownArrow = ArrowDropDownIcon,
  ...props
}) => {
  const childLinks = [
    { name: "item1", link: "/" },
    { name: "item1", link: "/" },
    { name: "item1", link: "/" },
    { name: "item1", link: "/" },
    { name: "item1", link: "/" },
    { name: "item1", link: "/" },
    { name: "item1", link: "/" },
    { name: "item1", link: "/" },
    { name: "item1", link: "/" },
  ];

const submenuData = useStaticQuery(graphql`
  query second {
    allStates {
      nodes {
        name
        counties {
          geoid
          name
        }
      }
    }
  }
`)

const subMenu = {}
subMenu.state = submenuData.allStates.nodes.map((d) => ({name: d.name, link: getTrackerUrl(d)}))
  .filter((d) => d.name !== "Texas")
  .filter((d) => data.state ? d.name !== data.state : d.name !== data.name)

if (data.state) subMenu.county = submenuData.allStates.nodes
  .find((d) => d.name === data.state)
  .counties.map((d) => ({name: d.name, link: getTrackerUrl({state: data.state, name: d.name})}))

  return (
    <ul className={clsx(classes.root, className)} {...props}>
      {links.map((bc, i) => (
        <li className={classes.listItem} key={bc.name}>
          {bc.name === "Texas" ? (
            <span>{bc.name}</span>
          ) : (
            <>
              <Link className={classes.link} to={bc.link}>
                <Box display="flex">
                  {bc.name === "Home" ? (
                    <Home className={classes.home} />
                  ) : (
                    bc.name
                  )}
                  {(bc.id === 'state' || bc.id === 'county') && <DropdownArrow className={classes.dropdown} />}
                </Box>
              </Link>

              <List className={classes.childItems}>
                {(bc.id === 'state' || bc.id === 'county') &&
                  subMenu[bc.id].map((menu) => (
                    <ListItem
                      key={menu.name}
                      component={GatsbyLink}
                      to={menu.link}
                      button
                    >
                      {menu.name}
                    </ListItem>
                  ))}
              </List>
            </>
          )}
          {i < links.length - 1 && <Separator className={classes.separator} />}
        </li>
      ))}
    </ul>
  );
};

Breadcrumb.propTypes = {};

export default withStyles(styles)(Breadcrumb);


