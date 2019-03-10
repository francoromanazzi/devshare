import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import isEmpty from '../../../../utils/is-empty';
import classNames from 'classnames';

import {
  deleteTagAtIndex,
  addNewTag
} from '../../../../store/actions/projectsActions';
import {
  setError,
  clearSpecificErrors
} from '../../../../store/actions/errorsActions';

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
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  chip: {
    margin: theme.spacing.unit
  },
  whiteText: {
    color: theme.palette.common.white
  },
  addIcon: {
    fontSize: '1.65em'
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
    this.props.clearSpecificErrors(['tag']);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onTagDelete = i => {
    this.props.deleteTagAtIndex(i);
  };

  onSubmit = () => {
    const { newTag } = this.state;

    // Validate input
    if (newTag === '') {
      this.props.setError({ tag: 'Tag content is required' });
      return;
    }

    this.props.addNewTag(newTag);

    this.handleClose();
  };

  render() {
    const { tags, classes, errors } = this.props;
    const { newTag, open } = this.state;

    const dialog = (
      <Dialog open={open} onClose={this.handleClose}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="newTag"
            label={!isEmpty(errors.tag) ? errors.tag : 'Add new tag'}
            value={newTag}
            onChange={this.onChange}
            error={!isEmpty(errors.tag)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            color="inherit"
            className={classes.whiteText}
          >
            Cancel
          </Button>
          <Button onClick={this.onSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );

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
            label="Add tag"
            className={classes.chip}
            deleteIcon={
              <Icon
                className={classNames('fas fa-plus-circle', classes.addIcon)}
              />
            }
            onDelete={this.handleOpen}
            variant="outlined"
          />
        </div>
        {dialog}
      </React.Fragment>
    );
  }
}

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  deleteTagAtIndex: PropTypes.func.isRequired,
  addNewTag: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  clearSpecificErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { deleteTagAtIndex, addNewTag, setError, clearSpecificErrors }
  )
)(Tags);
