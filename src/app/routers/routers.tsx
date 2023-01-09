import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import routersEndpoint from '@routers/routersEndpoint';

import Root from '@components/.';
import Home from '@components/Home/.';
import About from '@components/About/.';
import App from '@components/App/.';

import Error from '@components/Error';

const routes = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Root />} errorElement={<Error />}>
    <Route path={routersEndpoint.home} element={<Home />} />
    <Route path={routersEndpoint.about} element={<About />} />
    <Route path={routersEndpoint.app} element={<App />} />
  </Route>,
));

export default routes;
