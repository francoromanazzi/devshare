import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles, Grid, Paper, Typography, Button } from '@material-ui/core';
import GridContainer from '../common/grid-container/GridContainer';
import ProjectList from './ProjectList';

const styles = theme => ({
  paper: { ...theme.customs.paper },
  title: {
    marginBottom: theme.spacing.unit * 4
  },
  primary: {
    color: theme.palette.primary.main
  }
});

const Dashboard = ({ classes, history }) => {
  return (
    <GridContainer>
      <Grid item>
        <Paper className={classes.paper}>
          <Typography
            variant="h2"
            align="center"
            color="primary"
            className={classes.title}
          >
            Dashboard
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => history.push('/project/add')}
            color="secondary"
          >
            Share your project!
          </Button>
        </Paper>
      </Grid>
      <Grid item>
        <ProjectList />
      </Grid>
    </GridContainer>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
