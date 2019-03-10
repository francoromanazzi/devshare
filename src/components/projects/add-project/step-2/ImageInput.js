import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import isEmpty from '../../../../utils/is-empty';
import base64SrcFormat from '../../../../utils/base64-src-format';
import { includes } from 'lodash';
import {
  setError,
  clearSpecificErrors
} from '../../../../store/actions/errorsActions';

import { withStyles, Input, Typography } from '@material-ui/core';

const styles = theme => ({
  input: {
    marginTop: theme.spacing.unit * 2
  },
  errorInput: {
    marginBottom: theme.spacing.unit * 2
  },
  imagePreview: {
    marginTop: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
    height: '100%'
  }
});

export class ImageInput extends Component {
  state = {
    file: {}
  };

  onChange = e => {
    this.props.clearSpecificErrors(['imageInput']);

    let file = e.target.files[0];
    const fileType = file.type;
    const fileSize = file.size;

    this.setState({ file });

    // Validate file input
    if (!includes(['image/bmp', 'image/jpeg', 'image/png'], fileType)) {
      this.props.setError({ imageInput: 'File must be an image' });
    } else if (fileSize > Math.pow(2, 21)) {
      this.props.setError({ imageInput: 'File must be less than 2 MB' });
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.props.onFileReaderEnd(reader.result);
      };
    }
  };

  render() {
    const { base64, errors, classes } = this.props;

    const imagePreview = !isEmpty(errors.imageInput) ? (
      <Typography
        variant="subtitle1"
        color="error"
        className={classes.errorInput}
      >
        {errors.imageInput}
      </Typography>
    ) : base64 !== '' ? (
      <img
        src={base64SrcFormat(base64)}
        alt={this.state.file.name}
        className={classes.imagePreview}
      />
    ) : null;

    return (
      <React.Fragment>
        <Input
          type="file"
          name="imageInput"
          onChange={this.onChange}
          className={classes.input}
        />
        {imagePreview}
      </React.Fragment>
    );
  }
}

ImageInput.propTypes = {
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onFileReaderEnd: PropTypes.func.isRequired,
  base64: PropTypes.string.isRequired,
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
    { setError, clearSpecificErrors }
  )
)(ImageInput);
