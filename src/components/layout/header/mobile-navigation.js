import React from "react"
import clsx from "clsx"
import { Navigation } from "@hyperobjekt/material-ui-website";
import { Button, Drawer, withStyles } from "@material-ui/core";
import { useSiteValues } from "../../../hooks/use-site-store";

const MobileLinks = withStyles((theme) => ({
  root: {

  },
  list: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    flex: 1
  },
  link: {
    color: theme.palette.primary.main,
    padding: theme.spacing(2, 3),
    width: '100%',
    flex: 1
  },
}))(Navigation);

const styles = (theme) => ({
  root: {
    display: "block",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  button: {

  },
  drawer: {
    '& .MuiDrawer-paper': { minWidth: 320 }
  }
})

const MobileNavigation = ({ classes, className, links, anchor = "right", ...props }) => {
  
  const [ menuOpen, setMenuOpen ] = useSiteValues(['menuOpen', 'setMenuOpen'])

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className={clsx(classes.root, className)}>
      <Button className={classes.button} onClick={handleToggleMenu}>Menu</Button>
      <Drawer className={classes.drawer} anchor={anchor} open={menuOpen} onClose={handleToggleMenu}>
        <MobileLinks links={links} />
      </Drawer>
    </div>
  )

}

export default withStyles(styles)(MobileNavigation)