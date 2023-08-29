import React, { useEffect, useRef, useState } from 'react';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Button, Popconfirm, Table, Modal, message } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

import { list, update, remove } from '@apis/user';
import { listAll } from '@apis/tenant';

import { IUser } from '@ts/user';
import { ITenant } from '@ts/tenant';

import { isFailedRes } from '@utils/helper';

import UserDetail from './userDetail';

function ManegeUser() {
  const schema = yup.object().shape({
    password: yup
      .string()
      .notRequired()
      .min(6, 'Tối thiểu 6 kí tự')
      .nullable()
      .transform((value) => value || null),
    displayName: yup.string().required('Tên hiển thị không được để trống.'),
  });

  const { debounceValue, handle, inputSearch } = useSearch({}, { isUseDebounce: true });
  const { data, isLoading, reload } = useFetch<IUser, {}>(list, debounceValue);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<{ password?: string; id?: number; displayName: string }>({
    resolver: yupResolver(schema),
  });

  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState<IUser>();

  useEffect(() => {
    listAll().then((res) => {
      if (res.statusCode === 'OK') setTenants(res.data);
    });
  }, []);

  const userRef = useRef<any>();

  const handleDelete = async (id: number) => {
    const res = await remove(id);

    if (res.statusCode === 'OK') {
      reload();
      message.success('Xóa thành công');
    }
  };

  const toggleModal = (data?: IUser) => () => {
    setIsOpen(!isOpen);

    if (data) {
      setValue('id', data?.id);
      setValue('displayName', data?.displayName);
      setUpdateUser(data);
    } else {
      reset();
    }
  };

  const onSubmit = async (data: { password: string; displayName: string }) => {
    try {
      const res = await update({ ...data, id: updateUser?.id });

      switch (res.statusCode) {
        case 'OK':
          message.success(`Thay đổi mật khẩu cho tài khoản ${updateUser?.username} thành công`);
          toggleModal()();
          reload();
          reset();

          return;

        default:
          throw new Error('Đã xảy ra lỗi');
      }
    } catch (err: any) {
      if (isFailedRes(err)) {
        switch (err.statusCode) {
          case 'invalidCredentials':
          case 'FAILED':
            message.error(err.message);
            return;

          case 'RequiredField':
            Object.keys(err.message).forEach((v: any) => {
              setError(v, { type: 'custom', message: err.message[v][0] });
            });
            return;

          default:
            throw new Error('Đã xảy ra lỗi');
        }
      }
    }
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
      title: 'Nhà thuốc',
      dataIndex: 'tenantId',
      key: 'tenantId',
      width: 450,
      render: (tId: number) => <span> {tenants?.find((t) => t.id === tId)?.name} </span>,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: 50,
      render: (v: IUser) => (
        <>
          <EditTwoTone rev="true" style={{ marginRight: 12 }} onClick={toggleModal(v)} />
          <Popconfirm
            title="Xóa?"
            onConfirm={async () => {
              handleDelete(v.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteTwoTone rev="true" twoToneColor="red" />
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <div className="main_content">
      <div id="wrapper_btn">
        <Button onClick={userRef.current?.toggleModal}>Thêm mới</Button>
      </div>

      <div className="inputWithIcon">
        <input
          type="text"
          placeholder="Tìm theo tên đăng nhập hoặc tên hiển thị"
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
          pageSize: inputSearch.limit || 0,
        }}
      />

      <UserDetail ref={userRef} reload={reload} />

      <Modal
        title={`Cập nhật mật khẩu cho tài khoản ${updateUser?.username}`}
        open={isOpen}
        onCancel={toggleModal()}
        footer={[
          <Button onClick={toggleModal()} key="cancel">
            Hủy bỏ
          </Button>,
          <Button form="userForm" key="submit" htmlType="submit" type="primary">
            Cập nhật
          </Button>,
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} id="userForm" className="form" style={{ margin: 0, padding: 0 }}>
          <div className={`form-group ${errors.displayName ? 'error-form-group' : ''}`}>
            <label htmlFor="displayName">Tên hiển thị</label>
            <input type="text" id="displayName" {...register('displayName')} />

            <span className="error-message">{errors.displayName ? errors.displayName.message : ''}</span>
          </div>

          <div className={`form-group ${errors.password ? 'error-form-group' : ''}`}>
            <label htmlFor="password">Mật khẩu mới</label>
            <input type="password" id="password" {...register('password')} />

            <span className="error-message">{errors.password ? errors.password.message : ''}</span>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ManegeUser;
