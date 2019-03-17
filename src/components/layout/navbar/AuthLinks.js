import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import classNames from 'classnames';

import {
  withStyles,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Icon
} from '@material-ui/core';

const styles = theme => ({
  avatar: {
    height: '32px',
    width: '32px'
  },
  avatarButtonRoot: {
    padding: 8
  },
  menu: {
    marginTop: '38px'
  },
  menuPopover: {
    backgroundColor: theme.palette.background.paper
  },
  icon: {
    marginRight: '1rem',
    fontSize: '1rem',
    color: theme.palette.common.gray
  }
});

export class AuthLinks extends Component {
  state = {
    anchorEl: null
  };

  handleLogOutClick = () => {
    firebase.auth().signOut();
    this.handleProfileDropdownMenuClose();
  };

  handleProfileRedirect = () => {
    this.props.history.push(`/profiles/${this.props.auth.uid}`);
    this.handleProfileDropdownMenuClose();
  };

  handleProfileDropdownMenuOpen = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleProfileDropdownMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, auth } = this.props;
    const { anchorEl } = this.state;
    const profileDropdownMenuOpen = Boolean(anchorEl);

    const profileDropdownMenuContent = (
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={profileDropdownMenuOpen}
        onClose={this.handleProfileDropdownMenuClose}
        disableAutoFocusItem
        transitionDuration={150}
        className={classes.menu}
        PopoverClasses={{ paper: classes.menuPopover }}
      >
        <MenuItem onClick={this.handleProfileRedirect}>
          <Icon className={classNames('fas fa-user-alt', classes.icon)} />
          Profile
        </MenuItem>
        <MenuItem onClick={this.handleLogOutClick}>
          <Icon className={classNames('fas fa-sign-out-alt', classes.icon)} />
          Sign out
        </MenuItem>
      </Menu>
    );

    return (
      <React.Fragment>
        <IconButton
          aria-owns={profileDropdownMenuOpen ? 'menu-appbar' : undefined}
          aria-haspopup="true"
          onClick={this.handleProfileDropdownMenuOpen}
          color="inherit"
          classes={{ root: classes.avatarButtonRoot }}
        >
          <Avatar
            src={auth.photoURL}
            alt={`${auth.displayName}'s avatar`}
            className={classes.avatar}
          />
        </IconButton>
        {profileDropdownMenuContent}
      </React.Fragment>
    );
  }
}

AuthLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.firebase.auth
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps)
)(AuthLinks);
