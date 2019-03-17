import React from 'react';

import { Grid } from '@material-ui/core';
import GridContainer from '../common/grid-container/GridContainer';
import ProjectList from './ProjectList';

const Dashboard = () => {
  return (
    <GridContainer>
      <Grid item>
        <ProjectList />
      </Grid>
    </GridContainer>
  );
};

export default Dashboard;
