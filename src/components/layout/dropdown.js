import React from "react";
import clsx from "clsx";
import { Link } from "gatsby-material-ui-components";
import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    listStyle: "none",
    position: "absolute",
    alignItems: "center",
    padding: '0.5rem',
    margin: 0,
    color: 'white',
    top: '1.5rem',
    background: '#181817',
    opacity: '0',
    transition: 'opacity .2s ease-in-out'
  },
  listItem: {
  },
  link: {
  }
});

const states = ['Indiana', 'Alabama', 'Georgia']

const Dropdown = ({
  classes,
  className,
  ...props
}) => {
  return (
    <ul className={clsx(classes.root, className)} {...props}>
      {states.map((state, i) => (
        <li className={classes.listItem} key={state}>
          <Link className={classes.link} to={state}>
            {state}
          </Link>
        </li>
      ))}
    </ul>
  );
};

Dropdown.propTypes = {};

export default withStyles(styles)(Dropdown);
