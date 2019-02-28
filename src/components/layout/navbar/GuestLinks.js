import React from 'react';

import GithubLogin from '../../common/GithubLogin';

const GuestLinks = () => {
  return (
    <ul id="nav-mobile" className="right hide-on-med-and-down fa-ul">
      <li>
        <a href="#">Components</a>
      </li>
      <li>
        <a href="#">JavaScript</a>
      </li>
      <li>
        <GithubLogin />
      </li>
    </ul>
  );
};

export default GuestLinks;
