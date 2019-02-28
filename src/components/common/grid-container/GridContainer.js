import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from '@material-ui/core';

const styles = theme => ({
  root: {
    paddingRight: 15,
    paddingLeft: 15,
    marginRight: 'auto',
    marginLeft: 'auto',

    [theme.breakpoints.up('md')]: {
      // medium: 960px or larger
      width: 920
    },
    [theme.breakpoints.up('lg')]: {
      // large: 1280px or larger
      width: 1170
    },
    [theme.breakpoints.up('xl')]: {
      // extra-large: 1920px or larger
      width: 1366
    }
  }
});

const GridContainer = ({ classes, ...rest }) => (
  <Grid
    container
    className={classes.root}
    alignItems="stretch"
    justify="center"
    direction="column"
    {...rest}
  />
);

GridContainer.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(GridContainer);
