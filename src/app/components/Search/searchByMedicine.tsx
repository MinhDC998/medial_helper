import React, { useEffect } from 'react';
import { Table } from 'antd';
import { useLocation } from 'react-router-dom';

import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

import { list } from '@apis/medicine';

import { IMedicine, TSearchMedicine } from '@ts/medicine';
import { ISearch } from '@ts/common/common';

function SearchByMedicine(props: { resetDataAt?: string }) {
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: unknown, __: unknown, index: number) => <span>{++index}</span>,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (v: any) => (v ? <img src={v} alt={v} className="image_pill" /> : ''),
    },
    {
      title: 'Mã Thuốc',
      dataIndex: 'medicineCode',
      key: 'medicineCode',
      width: 200,
    },
    {
      title: 'Tên thuốc',
      dataIndex: 'medicineName',
      key: 'medicineName',
      width: 200,
    },
    {
      title: 'Liều lượng',
      dataIndex: 'dosage',
      key: 'dosage',
      width: 200,
    },
    {
      title: 'Thành phần chính',
      dataIndex: 'ingredients',
      key: 'ingredients',
      width: 200,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'specificObject',
      key: 'specificObject',
      width: 200,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
    },
  ];
  const location = useLocation();

  const { debounceValue, handle } = useSearch<TSearchMedicine>(
    {
      morbidness: location.state?.sicksSelected ? location.state?.sicksSelected.toString() : '',
      key: '',
    },
    { isUseDebounce: true },
  );
  const { data, isLoading, reload } = useFetch<IMedicine, ISearch>(list, debounceValue);

  console.log(debounceValue);

  useEffect(() => {
    if (props.resetDataAt !== '') reload();
  }, [props.resetDataAt]);

  return (
    <div style={{ marginTop: 24 }}>
      <div className="inputWithIcon">
        <input
          type="text"
          placeholder="Nhập tên hoặc thành phần thuốc"
          name="key"
          onChange={handle.handleChangeInputSearch}
        />
        <i className="fa fa-search fa-lg fa-fw" aria-hidden="true" />
      </div>

      <Table
        loading={isLoading}
        dataSource={(data?.statusCode === 'OK' && data.data.rows) || []}
        columns={columns}
        style={{ marginTop: 12 }}
        scroll={{ x: 400 }}
        rowKey="id"
        pagination={{
          onChange: (page) => handle.handleChangePage(page - 1),
          total: (data?.statusCode === 'OK' && data.data.count) || 0,
          pageSize: debounceValue!.limit || 0,
        }}
      />
    </div>
  );
}

export default SearchByMedicine;
