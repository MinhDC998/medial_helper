import React, { useEffect } from 'react';
import { Popconfirm, Table, message } from 'antd';
import { useLocation } from 'react-router-dom';

import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

import { list, remove } from '@apis/medicine';

import { IMedicine, TSearchMedicine } from '@ts/medicine';
import { ISearch } from '@ts/common/common';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import routersEndpoint from '@/app/routers/routersEndpoint';

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
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: 50,
      render: (v: IMedicine) => (
        <>
          <Link
            to={routersEndpoint.tenantManageMedicineById.replace(':medicineId', v.id.toString())}
            style={{ marginRight: 12 }}
          >
            <EditTwoTone rev={''} />
          </Link>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDelete(v.id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteTwoTone rev={''} twoToneColor={'red'} />
          </Popconfirm>
        </>
      ),
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

  useEffect(() => {
    if (props.resetDataAt !== '') reload();
  }, [props.resetDataAt]);

  const handleDelete = async (id: number) => {
    const res = await remove(id);
    if (res.statusCode === 'OK') {
      reload();
      message.success('Xóa thành công');
    }
  };

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
          onChange: (page, pageSize) => {
            handle.customChangePagination(page - 1, pageSize);
          },
          total: (data?.statusCode === 'OK' && data.data.count) || 0,
          pageSize: debounceValue.limit || 0,
        }}
      />
    </div>
  );
}

export default SearchByMedicine;
