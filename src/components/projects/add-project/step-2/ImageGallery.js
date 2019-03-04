import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import base64SrcFormat from '../../../../utils/base64-src-format';
import isEmpty from '../../../../utils/is-empty';
import {
  deleteImageAtIndex,
  addNewImage
} from '../../../../store/actions/projectsActions';
import { clearErrors, setError } from '../../../../store/actions/errorsActions';

import {
  withStyles,
  withWidth,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Icon,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField
} from '@material-ui/core';
import ImageInput from './ImageInput';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  title: {
    color: theme.palette.primary.light
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  }
});

export class ImageGallery extends Component {
  state = {
    zoomDialog: {
      open: false,
      currentImg: {}
    },
    uploadDialog: {
      open: false,
      title: '',
      base64: ''
    }
  };

  handleZoomOpen = img => {
    this.setState(prevState => ({
      zoomDialog: { ...prevState.zoomDialog, open: true, currentImg: img }
    }));
  };

  handleZoomClose = () => {
    this.setState(prevState => ({
      zoomDialog: { ...prevState.zoomDialog, open: false, currentImg: {} }
    }));
  };

  handleUploadOpen = () => {
    this.setState(prevState => ({
      uploadDialog: { ...prevState.uploadDialog, open: true }
    }));
  };

  handleUploadClose = () => {
    this.props.clearErrors();
    this.setState(prevState => ({
      uploadDialog: { ...prevState.uploadDialog, open: false, title: '' }
    }));
  };

  handleUploadSubmit = e => {
    const { uploadDialog } = this.state;

    // Validate input (file input was already validated)
    if (uploadDialog.title === '') {
      this.props.setError({ imageTitle: 'Title is required' });
      return;
    }

    this.props.addNewImage({
      title: uploadDialog.title,
      base64: uploadDialog.base64
    });

    this.handleUploadClose();
  };

  handleDelete = i => {
    this.props.deleteImageAtIndex(i);
  };

  onChange = e => {
    if (e.target.name === 'title') {
      const { value } = e.target;
      this.setState(prevState => ({
        uploadDialog: { ...prevState.uploadDialog, title: value }
      }));
    }
  };

  onFileReaderEnd = base64 => {
    this.setState(prevState => ({
      uploadDialog: { ...prevState.uploadDialog, base64 }
    }));
  };

  render() {
    const { classes, images, width, errors } = this.props;
    const { zoomDialog, uploadDialog } = this.state;

    const cols = width === 'xs' || width === 'sm' ? 1 : width === 'md' ? 2 : 3;

    const imageListContent = (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={cols}>
          {images.length > 0 &&
            images.map((img, i) => (
              <GridListTile key={i}>
                <img
                  src={base64SrcFormat(img.base64)}
                  alt={img.title}
                  onClick={this.handleZoomOpen.bind(this, img)}
                  style={{ cursor: 'pointer' }}
                />
                <GridListTileBar
                  title={img.title}
                  classes={{
                    root: classes.titleBar,
                    title: classes.title
                  }}
                  actionIcon={
                    <IconButton onClick={this.handleDelete.bind(this, i)}>
                      <Icon className="far fa-trash-alt" />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          <GridListTile
            onClick={this.handleUploadOpen}
            style={{ cursor: 'pointer' }}
          >
            <Typography variant="h6">Add new image</Typography>
          </GridListTile>
        </GridList>
      </div>
    );

    const dialogZoomViewContent = (
      <Dialog open={zoomDialog.open} onClose={this.handleZoomClose}>
        <DialogContent>
          <img
            src={base64SrcFormat(zoomDialog.currentImg.base64)}
            alt={zoomDialog.currentImg.title}
            style={{ width: '100%' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );

    const dialogUploadImageContent = (
      <Dialog open={uploadDialog.open} onClose={this.handleUploadClose}>
        <DialogContent>
          <Typography variant="h4" gutterBottom>
            Upload new image
          </Typography>
          <TextField
            margin="dense"
            name="title"
            label={
              !isEmpty(errors.imageTitle) ? errors.imageTitle : 'Image title'
            }
            value={uploadDialog.title}
            onChange={this.onChange}
            error={!isEmpty(errors.imageTitle)}
            fullWidth
          />
          <ImageInput
            onFileReaderEnd={this.onFileReaderEnd}
            base64={uploadDialog.base64}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleUploadClose} color="secondary">
            Close
          </Button>
          <Button onClick={this.handleUploadSubmit} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <React.Fragment>
        {imageListContent}
        {dialogZoomViewContent}
        {dialogUploadImageContent}
      </React.Fragment>
    );
  }
}

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  deleteImageAtIndex: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  addNewImage: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default compose(
  withStyles(styles),
  withWidth(),
  connect(
    mapStateToProps,
    { deleteImageAtIndex, setError, clearErrors, addNewImage }
  )
)(ImageGallery);
