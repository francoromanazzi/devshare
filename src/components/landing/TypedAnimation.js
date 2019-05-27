import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';

import Typed from 'typed.js';

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 4
  },
  text: {
    color: theme.palette.common.white,
    fontSize: '30px',
    fontWeight: '500'
  },
  primary: {
    color: theme.palette.primary.main
  }
});

class TypedAnimation extends Component {
  componentDidMount() {
    const strings = [
      'Share your projects.',
      'Look for contributors.',
      "Discover other developers' projects."
    ];

    const options = {
      strings: strings,
      startDelay: 1500,
      typeSpeed: 45,
      backSpeed: 50,
      backDelay: 500,
      loop: true,
      showCursor: true
    };

    // this.el refers to the <span> in the render() method
    this.typed = new Typed(this.el, options);

    this.typed.start();
  }

  componentWillUnmount() {
    this.typed.destroy();
  }

  render() {
    return (
      <div className={this.props.classes.root}>
        <span
          style={{ whiteSpace: 'pre' }}
          className={this.props.classes.text}
          ref={el => {
            this.el = el;
          }}
        />
      </div>
    );
  }
}

TypedAnimation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(withStyles(styles))(TypedAnimation);
