import React, { useState, FC, useEffect } from 'react';
import { Button, Modal, Table, message, Popconfirm } from 'antd';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import ROLE from '@constants/role';
import { TENANT_STATUS } from '@constants/tenant';
import { getUser } from '@utils/user';

import { IUser } from '@ts/user';
import { ITenant } from '@ts/tenant';

import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

import { create, list, update } from '@apis/tenant';
import { listAll, usersTenant } from '@apis/user';

import routersEndpoint from '@routers/routersEndpoint';

interface IAdminDashboard {
  selectedTenant: ITenant | undefined;
  handleNavigation: (url: string) => void;
  handleSelectTenant: (tenantData: ITenant | undefined) => void;
  searchComponent: JSX.Element;
}

const AdminDashboard: FC<IAdminDashboard> = (props: IAdminDashboard) => {
  const { selectedTenant, handleSelectTenant, searchComponent, handleNavigation } = props;
  const { inputSearch, handle } = useSearch();
  const { data, reload, isLoading } = useFetch<ITenant, {}>(list, inputSearch);

  const user = getUser();

  const schema = yup.object().shape({
    name: yup.string().required('Tên không được để trống.'),
  });

  const [edit, setEdit] = useState<ITenant>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [listUsers, setListUsers] = useState<IUser[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const filteredOptions = listUsers.filter((o) => !selectedUsers.includes(o.username));

  useEffect(() => {
    listAll().then((res) => {
      if (res.statusCode === 'OK') setListUsers(res.data);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<{ name: string }>({
    resolver: yupResolver(schema),
  });

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: unknown, __: unknown, index: number) => <span>{++index}</span>,
    },
    {
      title: 'Tên',
      render: (v: ITenant) => (
        <span
          onClick={() => {
            handleSelectTenant(v);
          }}
        >
          {v.name}
        </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: 50,
      render: (v: ITenant) => (
        <>
          <EditTwoTone
            rev="true"
            style={{ marginRight: 12 }}
            onClick={() => {
              handleEdit(v);
            }}
          />
          <Popconfirm title="Xóa?" onConfirm={async () => handleDelete(v)} okText="Yes" cancelText="No">
            <DeleteTwoTone rev="true" twoToneColor="red" />
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleDelete = async (data: ITenant) => {
    const res = await update(data.id, { ...data, status: TENANT_STATUS.DEACTIVATED });

    if (res.statusCode === 'OK') {
      reload();
      message.success('Xóa thành công');
    }
  };

  const handleEdit = async (data: ITenant) => {
    toggleModal();

    const selectUsers = await usersTenant(data.id);

    if (selectUsers.statusCode === 'OK') {
      setSelectedUsers(() => selectUsers.data.map((v) => v.username));
    }

    setEdit(data);
    setValue('name', data.name);
  };

  const onSubmit = async (data: { name: string }) => {
    try {
      const dataInput = { ...data, usersName: selectedUsers };
      const caller = !edit ? create(dataInput) : update(edit.id, dataInput);
      const res = await caller;

      switch (res.statusCode) {
        case 'invalidCredentials':
        case 'FAILED':
          setError('name', { type: 'custom', message: res.message });
          return;

        case 'RequiredField':
          Object.keys(res.message).forEach((v: any) => {
            setError(v, { type: 'custom', message: res.message[v][0] });
          });
          return;

        case 'OK':
          message.success('Thêm mới thành công');
          toggleModal();
          reload();
          reset();

          return;

        default:
          throw new Error('Đã xảy ra lỗi');
      }
    } catch (err) {
      throw new Error('Đã xảy ra lỗi');
    }
  };

  const toggleModal = () => {
    setSelectedUsers([]);
    setIsOpenModal(!isOpenModal);
    reset();
    setEdit(undefined);
  };

  return selectedTenant && +user.role === ROLE.ADMIN ? (
    <div id="wrapper_selection">
      <p>
        Bạn đang chọn chi nhánh:
        <strong>{selectedTenant?.name}</strong>
      </p>
      <div
        className="button_select cursor-pointer"
        onClick={() => {
          handleNavigation(routersEndpoint.tenantManagementUser);
        }}
      >
        Quản lý người dùng
      </div>
    </div>
  ) : (
    <>
      {+user.role === ROLE.ADMIN && (
        <div id="wrapper_btn">
          <Button onClick={toggleModal}>Thêm mới</Button>
        </div>
      )}
      <div id="wrapper_tenant">
        <Table
          loading={isLoading}
          dataSource={(data?.statusCode === 'OK' && data.data.rows) || []}
          columns={columns}
          style={{ marginTop: 12 }}
          rowKey="id"
          rowClassName="cursor-pointer"
          scroll={{ x: 996 }}
          // onRow={(record) => ({
          //   onClick: () => {
          //     handleSelectTenant(record);
          //   },
          // })}
          pagination={{
            onChange: (page) => {
              handle.handleChangePage(page - 1);
            },
            total: (data?.statusCode === 'OK' && data.data.count) || 0,
            pageSize: inputSearch.limit || 0,
          }}
        />

        <Modal
          title="Thêm mới nhà thuốc"
          open={isOpenModal}
          onCancel={toggleModal}
          footer={[
            <Button onClick={toggleModal} key="cancel">
              Hủy bỏ
            </Button>,
            <Button form="tenantForm" key="submit" htmlType="submit" type="primary">
              Thêm
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)} id="tenantForm" className="form" style={{ margin: 0, padding: 0 }}>
            <div className={`form-group ${errors.name ? 'error-form-group' : ''}`}>
              <label htmlFor="name">Tên nhà thuốc</label>
              <input type="text" id="name" {...register('name')} />

              <span className="error-message">{errors.name ? errors.name.message : ''}</span>
            </div>

            {/* <div className={`form-group ${errors.name ? 'error-form-group' : ''}`}>
              <label htmlFor="name">Thêm/xóa quản lý nhà thuốc</label>

              <Select
                mode="multiple"
                value={selectedUsers}
                onChange={setSelectedUsers}
                style={{ width: '100%', padding: '6px 0' }}
                options={filteredOptions}
                fieldNames={{ value: 'username', label: 'username' }}
              />

              <span className="error-message">{errors.name ? errors.name.message : ''}</span>
            </div> */}
          </form>
        </Modal>
      </div>
    </>
  );
};

export default AdminDashboard;
