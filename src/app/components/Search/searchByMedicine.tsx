import React, { useEffect, useState } from 'react';
import { Popconfirm, Table, Select } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';

import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

import { list, listStatus } from '@apis/medicine';

import { IMedicine, TSearchMedicine, TListMedicineRes } from '@ts/medicine';
import { ISearch } from '@ts/common/common';
import { getUser as user } from '@utils/user';
import UserRole from '@constants/role';

import routersEndpoint from '@routers/routersEndpoint';

function SearchByMedicine(props: { resetDataAt?: string }) {
  const { resetDataAt } = props;

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
      render: (v: IMedicine['dosage']) => (
        <div className="wrapper_dosage">{v && v.split('.').map((p, i) => <p key={`${p} + ${i}`}> {p} </p>)}</div>
      ),
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
      render: (v: IMedicine) =>
        +user().role === UserRole.TENANT_USER && (
          <>
            <Link
              to={routersEndpoint.tenantManageMedicineById.replace(':medicineId', v.id.toString())}
              style={{ marginRight: 12 }}
            >
              <EditTwoTone rev="true" />
            </Link>
            <Popconfirm title="Xóa" onConfirm={async () => handleDelete(v.id)} okText="Xóa" cancelText="Không">
              <DeleteTwoTone rev="true" twoToneColor="red" />
            </Popconfirm>
          </>
        ),
    },
  ];

  const location = useLocation();
  const morbidness = location.state?.sicksSelected ? location.state?.sicksSelected.toString() : '';

  const { debounceValue, handle } = useSearch<TSearchMedicine>(
    {
      morbidness,
      diseaseStatus: '',
      specificObject: '',
      key: '',
      limit: 25,
    },
    { isUseDebounce: true },
  );

  const { data, isLoading, reload } = useFetch<IMedicine, ISearch>(list, debounceValue);
  const { data: statusData } = useFetch<TListMedicineRes, ISearch>(listStatus, debounceValue);

  const [listData, setListData] = useState(data);

  useEffect(() => {
    if (resetDataAt !== '') reload();
  }, [resetDataAt]);

  useEffect(() => {
    setListData(data);
  }, [data]);

  const handleDelete = async (id: number) => {
    // const res = await remove(id);
    // if (res.statusCode === 'OK') {
    //   reload();
    //   message.success('Xóa thành công');
    // }
    if (listData?.statusCode === 'OK') {
      setListData((prev) => {
        if (prev?.statusCode === 'OK') {
          return { ...prev, data: { rows: prev.data.rows.filter((v) => v.id !== id), count: prev.data.count - 1 } };
        }

        return prev;
      });
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

      {morbidness !== '' && (
        <>
          <div id="wrapper_sick_selected">
            <span>Các triệu chứng đã chọn:</span>
            {morbidness.replaceAll(',', ', ')}
          </div>

          <div id="wrapper_selection">
            <Select
              className="a"
              placeholder="Chọn đối tượng"
              onChange={(e) => {
                handle.customChangeInputSearch({ diseaseStatus: e });
              }}
              value={debounceValue.diseaseStatus || null}
              // @ts-expect-error
              options={statusData?.data.diseaseStatus.map((v) => ({ value: v, label: v })) || []}
            />

            <Select
              placeholder="Tình trạng bệnh"
              onChange={(e) => {
                handle.customChangeInputSearch({ specificObject: e });
              }}
              value={debounceValue.specificObject || null}
              // @ts-expect-error
              options={statusData?.data.specificObject.map((v) => ({ value: v, label: v })) || []}
            />
          </div>
        </>
      )}

      <Table
        loading={isLoading}
        dataSource={(listData?.statusCode === 'OK' && listData.data.rows) || []}
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
