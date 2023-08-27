import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import routersEndpoint from '@routers/routersEndpoint';

import Root from '@components/.';
import Home from '@components/Home/.';
import Login from '@components/Login';
import Search from '@components/Search';
import Tenant from '@components/Tenant';
import ManageMedicine from '@components/Tenant/Manage/Medicine';
import ManageMedicineDetail from '@components/Tenant/Manage/MedicineDetail';
import Error from '@components/Error';
import ManageUser from '@components/User/user';

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routersEndpoint.login} element={<Login />} />

      <Route element={<Root />}>
        <Route path={routersEndpoint.home} element={<Home />} />
        <Route path={routersEndpoint.searchBy} element={<Search />} />
        <Route path={routersEndpoint.tenant} element={<Tenant />} />
        <Route path={routersEndpoint.tenantManageMedicine} element={<ManageMedicine />} />
        <Route path={routersEndpoint.tenantManageMedicineById} element={<ManageMedicineDetail />} />
        <Route path={routersEndpoint.tenantManagementUser} element={<ManageUser />} />
      </Route>
      <Route path="*" element={<Error />} />
    </Route>,
  ),
);

export default routes;
