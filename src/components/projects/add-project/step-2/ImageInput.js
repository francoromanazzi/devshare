import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEmpty from '../../../../utils/is-empty';
import base64SrcFormat from '../../../../utils/base64-src-format';
import { includes } from 'lodash';
import { setError } from '../../../../store/actions/errorsActions';

import { Input, Typography } from '@material-ui/core';

export class ImageInput extends Component {
  onChange = e => {
    let file = e.target.files[0];
    const fileType = file.type;
    const fileSize = file.size;
    console.log(file);

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
    const { base64, errors } = this.props;

    const imagePreview = !isEmpty(errors.imageInput) ? (
      <Typography variant="h6">{errors.imageInput}</Typography>
    ) : base64 !== '' ? (
      <img src={base64SrcFormat(base64)} />
    ) : null;

    return (
      <React.Fragment>
        <Input type="file" name="imageInput" onChange={this.onChange} />
        {imagePreview}
      </React.Fragment>
    );
  }
}

ImageInput.propTypes = {
  errors: PropTypes.object.isRequired,
  onFileReaderEnd: PropTypes.func.isRequired,
  base64: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { setError }
)(ImageInput);
