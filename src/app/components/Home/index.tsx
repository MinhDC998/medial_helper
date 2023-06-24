/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { getUser as user } from '@utils/user';
import { useNavigate, useLocation } from 'react-router-dom';

import { ITenant } from '@ts/tenant';
import UserRole from '@constants/role';

import './styles.scss';
import routersEndpoint from '@routers/routersEndpoint';

const columns = [
  {
    title: 'STT',
    dataIndex: 'index',
    key: 'index',
    render: (_: unknown, __: unknown, index: number) => <span>{++index}</span>,
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
  },
];

const dumpListTenant = [
  {
    id: 1,
    name: 'Chi nhanh Tan My',
  },
  {
    id: 2,
    name: 'Chi nhanh Dinh Thon',
  },
  {
    id: 3,
    name: 'Chi nhanh Pham Hung',
  },
];

function Home(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const [tenant] = useState<ITenant[]>(dumpListTenant);
  const [selectedTenant, setSelectedTenant] = useState<undefined | ITenant>(undefined);

  useEffect(() => {
    if (location?.state?.tenant) {
      setSelectedTenant(tenant.find((v) => v.id === location.state.tenant));
    }
  }, []);

  const handleSelectTenant = (tenantData: ITenant | undefined) => {
    navigate(routersEndpoint.home, { replace: true, state: { tenant: tenantData?.id } });
    setSelectedTenant(tenantData);
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

    const adminComponents = (
      <>
        <p>
          Bạn đang chọn chi nhánh:
          <strong>{selectedTenant?.name}</strong>
        </p>

        <div
          className="button_select cursor-pointer"
          onClick={() => {
            handleNavigation(routersEndpoint.tenantManageMedicine.replace(':id', '1'));
          }}
        >
          Quản lý danh mục thuốc
        </div>

        {searchComponent}

        <div className="button_select cursor-pointer"> Quản lý người dùng </div>
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

    switch (role) {
      case UserRole.ADMIN:
        if (!selectedTenant) {
          return (
            <div id="wrapper_tenant">
              <Table
                dataSource={tenant}
                columns={columns}
                style={{ marginTop: 12 }}
                rowKey="id"
                rowClassName="cursor-pointer"
                onRow={(record) => ({
                  onClick: () => {
                    handleSelectTenant(record);
                  },
                })}
              />
            </div>
          );
        }

        return <div id="wrapper_selection">{adminComponents}</div>;

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

      {/* <div className="inputWithIcon">
        <input type="text" placeholder="Nhập tên bệnh hoặc triệu chứng" />
        <i className="fa fa-search fa-lg fa-fw" aria-hidden="true" />
      </div>
      <div id="wrapper_symptom">
        {test.map((_, i) => (
          <div className="symptom" key={i}>
            Sample
          </div>
        ))}
      </div> */}

      {/* <div>
        <Select
          defaultValue=""
          options={[
            { value: '', label: 'Chọn đối tượng' },
            { value: 'jack', label: 'Trẻ em dưới 2 tuổi' },
          ]}
        />

        <Select
          defaultValue=""
          style={{ marginLeft: 24 }}
          options={[
            { value: '', label: 'Tình trạng bệnh' },
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
            { value: 'disabled', label: 'Disabled', disabled: true },
          ]}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <div id="test"> Cảm cúm</div>

        <span style={{ display: 'flex', alignItems: 'center' }}>{`${dataSource.length} Kết quả tìm kiếm `}</span>
        <Table dataSource={dataSource} columns={columns} style={{ marginTop: 12 }} scroll={{ x: 400 }} />
      </div> */}

      {handleRenderContent()}
    </div>
  );
}

export default Home;
