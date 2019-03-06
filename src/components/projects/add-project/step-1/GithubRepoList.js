import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import isEmpty from '../../../../utils/is-empty';

import { getReposFromUser } from '../../../../store/actions/reposActions';

import { withStyles, List, Typography } from '@material-ui/core';
import Spinner from '../../../common/spinner/Spinner';
import GithubRepoItem from './GithubRepoItem';

const styles = theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: '40vh',
    border: `2px ${theme.palette.primary.main} solid`
  }
});

export class GithubRepoList extends Component {
  componentDidMount() {
    const { getReposFromUser, username } = this.props;
    getReposFromUser(username);
  }

  render() {
    const {
      repos: { repos, loading },
      classes
    } = this.props;

    let content = loading ? (
      <Spinner />
    ) : repos.length === 0 ? (
      <Typography variant="h5" gutterBottom>
        You have no public repositories
      </Typography>
    ) : (
      <List className={classes.list}>
        {repos.map(repo => (
          <GithubRepoItem repo={repo} key={repo.id} />
        ))}
      </List>
    );
    return content;
  }
}

GithubRepoList.propTypes = {
  classes: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  getReposFromUser: PropTypes.func.isRequired,
  repos: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  username: state.firebase.profile.username,
  repos: state.repos
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { getReposFromUser }
  )
)(GithubRepoList);
