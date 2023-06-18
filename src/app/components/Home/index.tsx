/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

import React, { useState } from 'react';
import { Table } from 'antd';
import { getUser as user } from '@utils/user';

import { ITenant } from '@ts/tenant';
import UserRole from '@constants/role';

import './styles.scss';

// const dataSource = [
//   {
//     key: '1',
//     image:
//       'https://www.allcarepharmacy.ie/media/catalog/product/cache/30ef0a5a34180d98365b16f59a39bc5a/o/t/otc_-_470_x_470_22__1.png',
//     pillCode: 'HN003',
//     pillName: 'Thuốc ho',
//     medicineDose: 'Sáng-1 tối-1',
//     ingredient: 'Paracetamol',
//     target: '1-2 tuổi',
//     note: 'Kệ dưới',
//   },
//   {
//     key: '2',
//     image: '',
//     pillCode: 'HN004',
//     pillName: 'Panadon',
//     medicineDose: 'Sáng-1 tối-1',
//     ingredient: 'VVVV',
//     target: 'XXXX',
//     note: 'Kệ dưới',
//   },
// ];

const columns = [
  // {
  //   title: 'Hình ảnh',
  //   dataIndex: 'image',
  //   key: 'image',
  //   render: (v: any) => (v ? <img src={v} alt={v} className="image_pill" /> : ''),
  // },
  // {
  //   title: 'Mã Thuốc',
  //   dataIndex: 'pillCode',
  //   key: 'pillCode',
  // },
  // {
  //   title: 'Tên thuốc',
  //   dataIndex: 'pillName',
  //   key: 'pillName',
  // },
  // {
  //   title: 'Liều lượng',
  //   dataIndex: 'medicineDose',
  //   key: 'medicineDose',
  // },
  // {
  //   title: 'Thành phần chính',
  //   dataIndex: 'ingredient',
  //   key: 'ingredient',
  // },
  // {
  //   title: 'Đối tượng',
  //   dataIndex: 'target',
  //   key: 'target',
  // },
  // {
  //   title: 'Ghi chú',
  //   dataIndex: 'note',
  //   key: 'note',
  // },
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
  const [tenant] = useState<ITenant[]>(dumpListTenant);
  const [selectedTenant, setSelectedTenant] = useState<undefined | ITenant>(undefined);

  const handleSelectTenant = (tenantData: ITenant | undefined) => {
    setSelectedTenant(tenantData);
  };

  const handleRenderContent = () => {
    const { role } = user();

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

        return (
          <div id="wrapper_selection">
            <span
              onClick={() => {
                handleSelectTenant(undefined);
              }}
            >
              Chọn lại chi nhánh
            </span>

            <p>
              Bạn đang chọn chi nhánh:
              <strong>{selectedTenant.name}</strong>
            </p>
            <div className="button_select cursor-pointer"> Quản lý danh mục thuốc </div>
            <div className="button_select cursor-pointer"> Truy vấn dữ liệu thuốc </div>
            <div className="button_select cursor-pointer"> Quản lý người dùng </div>
          </div>
        );

      case UserRole.TENANT_USER:
        return (
          <div id="wrapper_selection">
            <div className="button_select cursor-pointer"> Truy vấn dữ liệu thuốc </div>
          </div>
        );

      case UserRole.USER:
        return (
          <div id="wrapper_selection">
            <div className="button_select cursor-pointer"> Tra cứu theo thuốc </div>
            <div className="button_select cursor-pointer"> Tra cứu theo bệnh </div>
          </div>
        );

      default:
        throw new Error('No role');
    }
  };

  return (
    <div className="main_content">
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
