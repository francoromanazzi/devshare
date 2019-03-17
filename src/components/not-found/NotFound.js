import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, Paper, Typography, Grid } from '@material-ui/core';
import GridContainer from '../common/grid-container/GridContainer';

const styles = theme => ({
  paper: { ...theme.customs.paper },
  primary: {
    color: theme.palette.primary.main
  }
});

const NotFound = ({ classes }) => {
  return (
    <GridContainer>
      <Grid item>
        <Paper className={classes.paper}>
          <Typography variant="h2" align="center" className={classes.title}>
            404 <span className={classes.primary}>not found</span>
          </Typography>
        </Paper>
      </Grid>
    </GridContainer>
  );
};

NotFound.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NotFound);
