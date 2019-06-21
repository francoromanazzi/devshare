import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase, withFirestore } from 'react-redux-firebase';

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
  Icon,
  Paper,
  MenuList,
  MenuItem,
  Popper,
  Grow
} from '@material-ui/core/';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Spinner from '../../common/spinner/Spinner';

import AuthLinks from './AuthLinks';
import GuestLinks from './GuestLinks';

import { searchInput } from '../../../store/actions/projectsActions';

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
  searchMobile: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
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
      width: 140,
      '&:focus': {
        width: 220
      }
    }
  },
  inputInputMobile: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    transition: theme.transitions.create('width'),
    width: 100,
    '&:focus': {
      width: 140
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
  },
  menu: {
    marginTop: '38px'
  },
  menuPopover: {
    backgroundColor: theme.palette.background.paper
  },
  noResultsFound: {
    padding: theme.spacing.unit * 3
  }
});

export class PrimarySearchAppBar extends Component {
  state = {
    menuOpen: false,
    search: '',
    searchResultsOpen: false,
    showSearchIconInMobile: true
  };

  toggleDrawer = value => {
    this.setState({ menuOpen: value });
  };

  handleSearchChange = event => {
    this.setState({
      search: event.target.value,
      searchResultsOpen: true
    });
    this.props.searchInput(event.target.value);
  };

  handleSearchResultsClose = event => {
    if (this.searchResultsAnchorRef.contains(event.target)) return;

    this.setState({ searchResultsOpen: false, showSearchIconInMobile: true });
  };

  handleSearchIconClickInMobile = () => {
    this.setState({ showSearchIconInMobile: false });
  };

  render() {
    const {
      classes,
      auth,
      history,
      searchedProjects,
      projectsLoading
    } = this.props;
    const {
      menuOpen,
      search,
      searchResultsOpen,
      showSearchIconInMobile
    } = this.state;

    const content = auth.isEmpty ? <GuestLinks /> : <AuthLinks />;

    const searchDesktop = (
      <div className={classes.sectionDesktop}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            inputRef={node => {
              this.searchResultsAnchorRef = node;
            }}
            aria-owns={searchResultsOpen ? 'search-results' : undefined}
            aria-haspopup="true"
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ 'aria-label': 'Search' }}
            value={search}
            onChange={this.handleSearchChange}
          />
        </div>
      </div>
    );

    const searchMobile = (
      <div className={classes.sectionMobile}>
        <IconButton
          aria-haspopup="true"
          onClick={this.handleSearchIconClickInMobile}
          color="inherit"
        >
          <SearchIcon />
        </IconButton>
      </div>
    );

    const searchMobileExpanded = (
      <div className={classes.searchMobile}>
        {' '}
        <InputBase
          inputRef={node => {
            this.searchResultsAnchorRef = node;
          }}
          aria-owns={searchResultsOpen ? 'search-results' : undefined}
          aria-haspopup="true"
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInputMobile
          }}
          inputProps={{ 'aria-label': 'Search' }}
          value={search}
          onChange={this.handleSearchChange}
        />
      </div>
    );

    const searchedProjectsResults = (
      <Popper
        open={searchResultsOpen}
        anchorEl={this.searchResultsAnchorRef}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper id="search-results">
              <ClickAwayListener onClickAway={this.handleSearchResultsClose}>
                {projectsLoading ? (
                  <Spinner />
                ) : searchedProjects.length === 0 ? (
                  <Typography variant="h5" className={classes.noResultsFound}>
                    No results found
                  </Typography>
                ) : (
                  <MenuList>
                    {searchedProjects.map(project => (
                      <MenuItem key={project.id}>
                        <span
                          onClick={() => history.push(`/project/${project.id}`)}
                        >
                          {project.title}
                        </span>
                      </MenuItem>
                    ))}
                  </MenuList>
                )}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
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
            {searchedProjectsResults}
            <div className={classes.grow} />
            {showSearchIconInMobile ? searchMobile : searchMobileExpanded}
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
  profile: PropTypes.object.isRequired,
  searchInput: PropTypes.func.isRequired,
  firebase: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  searchedProjects: PropTypes.array.isRequired,
  projectsLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  searchedProjects: state.projects.searchedProjects,
  projectsLoading: state.projects.loading
});

const mapDispatchToProps = (dispatch, { firebase, firestore }) => ({
  searchInput: (...args) =>
    dispatch(searchInput(...args, { firebase, firestore }))
});

export default compose(
  withFirebase,
  withFirestore,
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PrimarySearchAppBar);
