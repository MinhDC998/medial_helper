import React, { useRef } from 'react';
import { DeleteTwoTone } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';

import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

import { list } from '@apis/user';

import { IUser } from '@ts/user';

import UserDetail from './userDetail';
// import './styles.scss';

function ManegeUser() {
  const { inputSearch, handle } = useSearch();
  const { data, isLoading } = useFetch<IUser, {}>(list, inputSearch);

  const userRef = useRef<any>();

  const handleDelete = (username: string) => {
    console.log({ username });
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: unknown, __: unknown, index: number) => <span>{++index}</span>,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 250,
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'displayName',
      key: 'displayName',
      width: 350,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: 50,
      render: (v: IUser) => (
        <Popconfirm
          title="Xóa?"
          onConfirm={async () => {
            handleDelete(v.username);
          }}
          okText="Yes"
          cancelText="No"
        >
          <DeleteTwoTone rev="true" twoToneColor="red" />
        </Popconfirm>
      ),
    },
  ];
  return (
    <div className="main_content">
      <div id="wrapper_btn">
        <Button onClick={userRef.current?.toggleModal}>Thêm mới</Button>
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
          pageSize: inputSearch.limit || 0,
        }}
      />

      <UserDetail ref={userRef} />
    </div>
  );
}

export default ManegeUser;
