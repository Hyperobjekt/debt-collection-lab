import React from "react";
import clsx from "clsx";
import { Link } from "gatsby-material-ui-components";
import HomeIcon from "@material-ui/icons/Home";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { withStyles } from "@material-ui/core";
import Dropdown from "./dropdown"
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
    "&:hover $childItems, &:focus $childItems": {
      display: "block"
    }
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
  dropdown:{
    fontSize: 20,
  },
  childItems: {
    display: "none",
    position: "absolute",
    top: 24,
    width: 300,
    maxHeight: "80vh",
    overflow: "auto",
    listStyle: "none",
    padding: 0,
    margin: 0,
  }
});

const Breadcrumb = ({
  classes,
  className,
  links,
  Home = HomeIcon,
  Separator = ChevronRight,
  DropdownArrow = ArrowDropDownIcon,
  ...props
}) => {
  const childLinks = [
    { name: 'item1', link: '/' },
    { name: 'item1', link: '/' },
    { name: 'item1', link: '/' },
    { name: 'item1', link: '/' },
    { name: 'item1', link: '/' }, 
    { name: 'item1', link: '/' },
    { name: 'item1', link: '/' },
    { name: 'item1', link: '/' },
    { name: 'item1', link: '/' }
  ];
  return (
    <ul className={clsx(classes.root, className)} {...props}>
      {links.map((bc, i) => (
        <li className={classes.listItem} key={bc.name}>
          {bc.name === "Texas" ? (
            <span>{bc.name}</span>
          ) : (
            <>
              <Link className={classes.link} to={bc.link}>
                {bc.name === "Home" ? <Home className={classes.home} /> : bc.name}
              </Link>
              <DropdownArrow className={classes.dropdown} />
              <ul className={classes.childItems}>
                {childLinks.map(({ name, link }) => (
                <li key={name}><a href={link}>{name}</a></li>
                ))}
              </ul>
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
