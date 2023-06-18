import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import routersEndpoint from '@routers/routersEndpoint';

import Root from '@components/.';
import Home from '@components/Home/.';
import Login from '@components/Login';
import Search from '@components/Search';

import Error from '@components/Error';

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<Error />}>
      <Route path={routersEndpoint.login} element={<Login />} />

      <Route element={<Root />}>
        <Route path={routersEndpoint.home} element={<Home />} />
        <Route path={routersEndpoint.searchBy} element={<Search />} />
      </Route>
    </Route>,
  ),
);

export default routes;
