import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { getUser as user } from '@utils/user';
import { useNavigate } from 'react-router-dom';

import { ITenant } from '@ts/tenant';
import UserRole from '@constants/role';
import { COMMON } from '@constants/common';
import routersEndpoint from '@routers/routersEndpoint';
import * as cookie from '@services/cookies';

import AdminDashboard from './adminDashboard';
import './styles.scss';

function Home(): JSX.Element {
  const navigate = useNavigate();

  const [selectedTenant, setSelectedTenant] = useState<undefined | ITenant>(undefined);

  useEffect(() => {
    const tenant = cookie.default.get(COMMON.COOKIE.TENANT);
    if (tenant) setSelectedTenant(tenant);
  }, []);

  const handleSelectTenant = (tenantData: ITenant | undefined) => {
    navigate(routersEndpoint.home, { replace: true, state: { tenant: tenantData?.id } });
    setSelectedTenant(tenantData);

    if (tenantData) {
      cookie.default.set(tenantData, COMMON.COOKIE.TENANT);
    } else {
      cookie.default.remove(COMMON.COOKIE.TENANT);
    }
  };

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const handleRenderContent = () => {
    const { role } = user();
    const searchComponent = (
      <>
        <div
          key={routersEndpoint.searchByMedicine}
          className="button_select cursor-pointer"
          onClick={() => {
            handleNavigation(`${routersEndpoint.searchBy}`.replace(':by', routersEndpoint.searchByMedicine));
          }}
        >
          Tra cứu theo thuốc
        </div>
        <div
          key={routersEndpoint.searchBySick}
          className="button_select cursor-pointer"
          onClick={() => {
            handleNavigation(`${routersEndpoint.searchBy}`.replace(':by', routersEndpoint.searchBySick));
          }}
        >
          Tra cứu theo bệnh
        </div>
      </>
    );

    const tenantComponent = (
      <>
        <div
          className="button_select cursor-pointer"
          onClick={() => {
            handleNavigation(`${routersEndpoint.searchBy}`.replace(':by', routersEndpoint.searchByMedicine));
          }}
        >
          Truy vấn dữ liệu thuốc
        </div>
        {searchComponent}
      </>
    );

    switch (+role) {
      case UserRole.ADMIN:
        return (
          <AdminDashboard
            handleNavigation={handleNavigation}
            handleSelectTenant={handleSelectTenant}
            searchComponent={searchComponent}
            selectedTenant={selectedTenant}
          />
        );

      case UserRole.TENANT_USER:
        return <div id="wrapper_selection">{tenantComponent}</div>;

      case UserRole.USER:
        return <div id="wrapper_selection">{searchComponent}</div>;

      default:
        throw new Error('No role');
    }
  };

  return (
    <div className="main_content">
      {selectedTenant && (
        <Button
          onClick={() => {
            handleSelectTenant(undefined);
            navigate(routersEndpoint.home);
          }}
        >
          Chọn lại chi nhánh
        </Button>
      )}

      {handleRenderContent()}
    </div>
  );
}

export default Home;
