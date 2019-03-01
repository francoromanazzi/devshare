import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { deleteImageAtIndex } from '../../../../store/actions/projectsActions';

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
      title: ''
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
    this.setState(prevState => ({
      uploadDialog: { ...prevState.uploadDialog, open: false, title: '' }
    }));
  };

  handleDelete = i => {
    this.props.deleteImageAtIndex(i);
  };

  onChange = e => {
    // Grab e.target.value now because setState is async
    const title = e.target.value;
    this.setState(prevState => ({
      uploadDialog: { ...prevState.uploadDialog, title }
    }));
  };

  render() {
    const { classes, images, width } = this.props;
    const { zoomDialog, uploadDialog } = this.state;

    const cols = width === 'xs' || width === 'sm' ? 1 : width === 'md' ? 2 : 3;

    const imageListContent =
      images.length === 0 ? null : (
        <div className={classes.root}>
          <GridList className={classes.gridList} cols={cols}>
            {images.map((img, i) => (
              <GridListTile key={img.url}>
                <img
                  src={img.url}
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
            src={zoomDialog.currentImg.url}
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
            label="Image title"
            value={uploadDialog.title}
            onChange={this.onChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleUploadClose} color="secondary">
            Close
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

    /* 
    const content =
      images.length === 0 ? null : (
        <GridList cols={3}>
          {images.map(img => (
            <GridTile
              title={img.tags}
              key={img.id}
              subtitle={
                <span>
                  by <strong>{img.user}</strong>
                </span>
              }
              actionIcon={
                <IconButton onClick={() => this.handleOpen(img.largeImageURL)}>
                  <ZoomIn color="white" />
                </IconButton>
              }
            >
              <img src={img.largeImageURL} alt="" />
            </GridTile>
          ))}
        </GridList>
      );

    return content;*/
  }
}

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  deleteImageAtIndex: PropTypes.func.isRequired
};

export default compose(
  withStyles(styles),
  withWidth(),
  connect(
    null,
    { deleteImageAtIndex }
  )
)(ImageGallery);
