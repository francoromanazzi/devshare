import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, Typography, TextField, Paper } from '@material-ui/core';

const styles = {
  root: {
    backgroundColor: 'red'
  }
};

export class Landing extends Component {
  state = {
    title: ''
  };

  handleChange = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
    });

  render() {
    const { title } = this.state;
    const { auth, classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Typography variant="h3" align="center" gutterBottom>
          {auth.email}
        </Typography>
        <form>
          <TextField
            name="title"
            label="Exercise"
            value={title}
            onChange={this.handleChange}
            margin="normal"
          />
        </form>
      </Paper>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.firebase.auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Landing);