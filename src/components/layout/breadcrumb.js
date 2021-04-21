import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "gatsby-material-ui-components";
import HomeIcon from "@material-ui/icons/Home";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { withStyles } from "@material-ui/core";
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
});

const Breadcrumb = ({
  classes,
  className,
  links,
  Home = HomeIcon,
  Separator = ChevronRight,
  ...props
}) => {
  return (
    <ul className={clsx(classes.root, className)} {...props}>
      {links.map((bc, i) => (
        <li className={classes.listItem} key={bc.name}>
          <Link className={classes.link} to={bc.link}>
            {bc.name === "Home" ? <Home className={classes.home} /> : bc.name}
          </Link>
          {i < links.length - 1 && <Separator className={classes.separator} />}
        </li>
      ))}
    </ul>
  );
};

Breadcrumb.propTypes = {};

export default withStyles(styles)(Breadcrumb);
