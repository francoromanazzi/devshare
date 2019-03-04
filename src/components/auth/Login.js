import React from 'react';

import GithubLogin from '../common/GithubLogin';

const Login = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Sign up with Github</h1>
      <h4>Registered users can share their projects</h4>
      <GithubLogin style={{ height: '80px' }} />
    </div>
  );
};

export default Login;
