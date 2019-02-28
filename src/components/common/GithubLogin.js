import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { signUp } from '../../store/actions/authActions';

const GithubLogin = props => {
  return (
    <React.Fragment>
      <a
        onClick={props.signUp}
        href="#"
        style={{ backgroundColor: 'black', ...props.style }}
      >
        Log In{' '}
        <i className="fab fa-github" style={{ verticalAlign: 'middle' }} />
      </a>
    </React.Fragment>
  );
};

GithubLogin.propTypes = {
  style: PropTypes.object.isRequired,
  signUp: PropTypes.func.isRequired
};

export default connect(
  null,
  { signUp }
)(GithubLogin);
