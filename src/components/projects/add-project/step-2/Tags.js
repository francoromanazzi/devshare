import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  deleteTagAtIndex,
  addNewTag
} from '../../../../store/actions/projectsActions';

import {
  withStyles,
  Chip,
  Icon,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@material-ui/core';

const styles = theme => ({
  tags: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none'
  }
});

export class Tags extends Component {
  state = {
    open: false,
    newTag: ''
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, newTag: '' });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onTagDelete = i => {
    this.props.deleteTagAtIndex(i);
  };

  onSubmit = e => {
    const { newTag } = this.state;

    if (newTag !== '') this.props.addNewTag(newTag);

    this.handleClose();
  };

  render() {
    const { tags, classes } = this.props;
    const { newTag, open } = this.state;

    return (
      <React.Fragment>
        <div className={classes.tags}>
          {tags.map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              onDelete={this.onTagDelete.bind(this, i)}
              className={classes.chip}
            />
          ))}
          <Chip
            label="Add"
            className={classes.chip}
            deleteIcon={<Icon className="fas fa-plus-circle" />}
            onDelete={this.handleOpen}
            variant="outlined"
          />
        </div>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="newTag"
              label="Add new tag"
              value={newTag}
              onChange={this.onChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  deleteTagAtIndex: PropTypes.func.isRequired,
  addNewTag: PropTypes.func.isRequired
};

export default compose(
  withStyles(styles),
  connect(
    null,
    { deleteTagAtIndex, addNewTag }
  )
)(Tags);
