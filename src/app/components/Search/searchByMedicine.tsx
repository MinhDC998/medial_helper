import React from 'react';
import { Table } from 'antd';

const dataSource = [
  {
    key: '1',
    image:
      'https://www.allcarepharmacy.ie/media/catalog/product/cache/30ef0a5a34180d98365b16f59a39bc5a/o/t/otc_-_470_x_470_22__1.png',
    pillCode: 'HN003',
    pillName: 'Thuốc ho',
    medicineDose: 'Sáng-1 tối-1',
    ingredient: 'Paracetamol',
    target: '1-2 tuổi',
    note: 'Kệ dưới',
  },
  {
    key: '2',
    image: '',
    pillCode: 'HN004',
    pillName: 'Panadon',
    medicineDose: 'Sáng-1 tối-1',
    ingredient: 'VVVV',
    target: 'XXXX',
    note: 'Kệ dưới',
  },
];

const columns = [
  {
    title: 'Hình ảnh',
    dataIndex: 'image',
    key: 'image',
    render: (v: any) => (v ? <img src={v} alt={v} className="image_pill" /> : ''),
  },
  {
    title: 'Mã Thuốc',
    dataIndex: 'pillCode',
    key: 'pillCode',
  },
  {
    title: 'Tên thuốc',
    dataIndex: 'pillName',
    key: 'pillName',
  },
  {
    title: 'Liều lượng',
    dataIndex: 'medicineDose',
    key: 'medicineDose',
  },
  {
    title: 'Thành phần chính',
    dataIndex: 'ingredient',
    key: 'ingredient',
  },
  {
    title: 'Đối tượng',
    dataIndex: 'target',
    key: 'target',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
  },
];

function SearchByMedicine() {
  return (
    <div style={{ marginTop: 24 }}>
      <div className="inputWithIcon">
        <input type="text" placeholder="Nhập tên hoặc thành phần thuốc" />
        <i className="fa fa-search fa-lg fa-fw" aria-hidden="true" />
      </div>

      <Table dataSource={dataSource} columns={columns} style={{ marginTop: 12 }} scroll={{ x: 400 }} />
    </div>
  );
}

export default SearchByMedicine;
