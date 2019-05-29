import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Icon
} from '@material-ui/core/';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import AuthLinks from './AuthLinks';
import GuestLinks from './GuestLinks';

const styles = theme => ({
  root: {
    width: '100%',
    height: '48px' // Push everything else down (because of fixed appbar)
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: 'block'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3,
    width: 'auto'
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  appBar: {
    backgroundColor: theme.palette.background.light2
  },
  brand: {
    textDecoration: 'none',
    color: theme.palette.common.white,
    '&:hover': {
      color: fade(theme.palette.common.white, 0.25),
      '& span': {
        color: fade(theme.palette.primary.main, 0.25)
      }
    },
    [theme.breakpoints.up('md')]: {
      marginRight: 20
    }
  },
  primary: {
    color: theme.palette.primary.main
  },
  list: {
    width: 250
  }
});

export class PrimarySearchAppBar extends Component {
  state = {
    menuOpen: false
  };

  toggleDrawer = value => {
    this.setState({ menuOpen: value });
  };

  render() {
    const { classes, auth, history } = this.props;
    const { menuOpen } = this.state;

    const content = auth.isEmpty ? <GuestLinks /> : <AuthLinks />;

    const searchDesktop = (
      <div className={classes.sectionDesktop}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
          />
        </div>
      </div>
    );

    const searchMobile = (
      <div className={classes.sectionMobile}>
        <IconButton
          aria-haspopup="true"
          onClick={() => {
            console.log('search');
          }}
          color="inherit"
        >
          <SearchIcon />
        </IconButton>
      </div>
    );

    const menuDrawer = (
      <Drawer open={menuOpen} onClose={this.toggleDrawer.bind(this, false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={this.toggleDrawer.bind(this, false)}
          onKeyDown={this.toggleDrawer.bind(this, false)}
        >
          <div className={classes.list}>
            <List>
              <ListItem button onClick={() => history.push('/')}>
                <ListItemIcon>
                  <Icon className={'fas fa-home'} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </List>
            <Divider />
            <List>
              {['Search'].map(text => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </Drawer>
    );

    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="default" className={classes.appBar}>
          <Toolbar variant="dense">
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={this.toggleDrawer.bind(this, true)}
            >
              <MenuIcon />
            </IconButton>
            {menuDrawer}

            <Link to="/" className={classes.brand}>
              <Typography
                className={classes.title}
                variant="h5"
                color="inherit"
                noWrap
              >
                {'<'}
                <span className={classes.primary}>{'ds'}</span>
                {' />'}
              </Typography>
            </Link>
            {searchDesktop}
            <div className={classes.grow} />
            {searchMobile}
            {content}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps)
)(PrimarySearchAppBar);
