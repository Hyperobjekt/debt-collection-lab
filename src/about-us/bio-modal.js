import React from "react";
import {
  Typography,
  withStyles,
  Button,
  Box,
  Grid,
  Divider,
} from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

export const styles = (theme) => ({
  //styles for content component
  divider: {
    margin: "10px 0px"
  },
  vertDivider: {
    margin: 0
  },
  bioBox:{
    display: "flex",
    flexDirection: "column",
  },
  btnFlexBox: {
    flexGrow: 1,
    justifyContent: "right",
    display: "flex"
  },
  btnContainerBox: {
    display: 'flex',
    height: 'fit-content',
    marginTop: 'auto',
  },
  contentButton: {
    color: theme.palette.secondary.main,
    fontSize: theme.typography.pxToRem(16),
  },
});

const BioModal = ({
  members,
  selected,
  classes,
  ...props
}) => {

  const [index, setIndex] = React.useState(selected);

  const handleClick = (type) => {
    switch (type) {
      case "prev":
        index > 0 ? setIndex(index - 1) : setIndex(members.length - 1);
        break;
      case "next":
        index < members.length - 1 ? setIndex(index + 1) : setIndex(0);
        break;
      default:
        return;
    }
  };

  return(
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <GatsbyImage
          layout="fixed"
          alt="court room"
          image={getImage(members[index].headshot)}
        />
      </Grid>
      <Grid className={classes.bioBox} item xs={12} sm={8}>
        <Typography component="p" variant="h4">
          {members[index].title}
        </Typography>
        <Typography className={classes.creds} variant="body2">
          {members[index].creds}
        </Typography>
        <Divider className={classes.divider}/>
        <Typography variant="body2">
          {members[index].bio}
        </Typography>
        <Box className={classes.btnFlexBox}>
          <Box className={classes.btnContainerBox}>
            <Button className={classes.contentButton} startIcon={<NavigateBeforeIcon />} onClick={() => handleClick('prev')}>Previous Bio</Button>
            <Divider className={classes.vertDivider} flexItem orientation="vertical" variant="middle" />
            <Button className={classes.contentButton} endIcon={<NavigateNextIcon />} onClick={() => handleClick('next')}>Next Bio</Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(BioModal);
