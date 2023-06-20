import React from 'react';
import { Outlet } from 'react-router-dom';

import { getUser as user } from '@utils/user';

import './styles.scss';
import 'antd/dist/reset.css';
import '@public/css/core.scss';

function Root(): JSX.Element {
  return (
    <div>
      <header id="header">
        <div />
        <div id="header_user">
          <div id="header_avatar" />
          <span id="header_user_name">{user()?.displayName}</span>
        </div>
      </header>
      <Outlet />
      {/* <h1> Footer </h1> */}
    </div>
  );
}

export default Root;
