import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import base64SrcFormat from '../../../../utils/base64-src-format';
import isEmpty from '../../../../utils/is-empty';
import {
  deleteImageAtIndex,
  addNewImage,
  changeImageTitle
} from '../../../../store/actions/projectsActions';
import {
  clearSpecificErrors,
  setError
} from '../../../../store/actions/errorsActions';

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
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  gridList: {
    //flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    //transform: 'translateZ(0)'
  },
  title: {
    color: theme.palette.common.white
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0) 100%)'
  },
  whiteText: {
    color: theme.palette.common.white
  },
  input: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2
  },
  addNewImageTileContainer: {
    position: 'relative'
  },
  addNewImageTile: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '135px',
    width: '300px',
    margin: '-67.5px 0 0 -150px',
    textAlign: 'center',
    paddingTop: '35px',

    border: '2px dashed white',
    borderRadius: '25px',

    backgroundColor: theme.palette.background.paperLight2,
    '&:hover': {
      backgroundColor: theme.palette.background.paperLight,
      transition: 'background-color 0.25s'
    }
  },
  primary: {
    color: theme.palette.primary.main
  }
});

export class ImageGallery extends Component {
  state = {
    zoomDialog: {
      open: false,
      currentImg: {},
      editImgTitle: ''
    },
    uploadDialog: {
      open: false,
      title: '',
      base64: ''
    }
  };

  handleZoomOpen = img => {
    this.setState(prevState => ({
      zoomDialog: {
        ...prevState.zoomDialog,
        open: true,
        currentImg: img,
        editImgTitle: img.title
      }
    }));
  };

  handleZoomClose = () => {
    this.setState(
      prevState => ({
        zoomDialog: {
          ...prevState.zoomDialog,
          open: false,
          editImgTitle: ''
        }
      }),
      () => this.setState({ currentImg: {} })
    );
    this.props.clearSpecificErrors(['editImgTitle']);
  };

  handleZoomSave = () => {
    const { editImgTitle, currentImg } = this.state.zoomDialog;
    // Validation
    if (editImgTitle === '') {
      this.props.setError({ editImgTitle: 'Image title is required' });
      return;
    }
    this.props.changeImageTitle(currentImg.title, editImgTitle);
    this.handleZoomClose();
  };

  handleZoomTitleChange = e => {
    const editImgTitle = e.target.value;
    this.setState(prevState => ({
      zoomDialog: { ...prevState.zoomDialog, editImgTitle }
    }));
  };

  handleUploadOpen = () => {
    this.setState(prevState => ({
      uploadDialog: { ...prevState.uploadDialog, open: true }
    }));
  };

  handleUploadClose = () => {
    this.setState(prevState => ({
      uploadDialog: {
        ...prevState.uploadDialog,
        open: false,
        title: '',
        base64: ''
      }
    }));
    this.props.clearSpecificErrors(['imageInput', 'imageTitle']);
  };

  handleUploadSubmit = () => {
    const validateInputs = () => {
      let errors = false;

      if (uploadDialog.title === '') {
        errors = true;
        this.props.setError({ imageTitle: 'Image title is required' });
      }
      if (uploadDialog.base64 === '') {
        errors = true;
        this.props.setError({ imageInput: 'Image is required' });
      }

      return !errors;
    };

    const { uploadDialog } = this.state;

    // Validate input (file input was already validated)
    if (!validateInputs()) return;

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
        <GridList className={classes.gridList} cols={cols} spacing={8}>
          {images.length > 0 &&
            images.map((img, i) => (
              <GridListTile key={i}>
                {img.base64 !== undefined && (
                  <img
                    src={base64SrcFormat(img.base64)}
                    alt={img.title}
                    onClick={this.handleZoomOpen.bind(this, img)}
                    style={{ cursor: 'pointer' }}
                  />
                )}

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
          <GridListTile>
            <div style={{ cursor: 'pointer' }} onClick={this.handleUploadOpen}>
              <Typography variant="h6" color="primary">
                Add new image
              </Typography>
              <Icon className={classNames('fas fa-plus', classes.primary)} />
            </div>
          </GridListTile>
        </GridList>
      </div>
    );

    const dialogZoomViewContent = (
      <Dialog
        open={zoomDialog.open}
        onClose={this.handleZoomClose}
        maxWidth="md"
      >
        <DialogContent>
          {zoomDialog.currentImg.base64 !== undefined && (
            <img
              src={base64SrcFormat(zoomDialog.currentImg.base64)}
              alt={zoomDialog.currentImg.title}
              style={{ width: '100%' }}
            />
          )}
          <TextField
            placeholder="Edit image title here"
            label={
              !isEmpty(errors.editImgTitle)
                ? errors.editImgTitle
                : 'Image title'
            }
            name="editImgTitle"
            onChange={this.handleZoomTitleChange}
            fullWidth
            value={zoomDialog.editImgTitle}
            error={!isEmpty(errors.editImgTitle)}
            className={classes.input}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleZoomClose}
            color="inherit"
            className={classes.whiteText}
          >
            Close
          </Button>
          <Button onClick={this.handleZoomSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );

    const dialogUploadImageContent = (
      <Dialog
        open={uploadDialog.open}
        onClose={this.handleUploadClose}
        maxWidth="md"
      >
        <DialogContent>
          <Typography variant="h4" align="center" gutterBottom>
            Upload <span className={classes.primary}>new image</span>
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
            className={classes.input}
            required
          />
          <ImageInput
            onFileReaderEnd={this.onFileReaderEnd}
            base64={uploadDialog.base64}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleUploadClose}
            color="inherit"
            className={classes.whiteText}
          >
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
  clearSpecificErrors: PropTypes.func.isRequired,
  addNewImage: PropTypes.func.isRequired,
  changeImageTitle: PropTypes.func.isRequired,
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
    {
      deleteImageAtIndex,
      setError,
      clearSpecificErrors,
      addNewImage,
      changeImageTitle
    }
  )
)(ImageGallery);
