import React, { useState, FC } from 'react';
import { Button, Modal, Table, message } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ITenant } from '@ts/tenant';
import routersEndpoint from '@routers/routersEndpoint';
import { create, list } from '@/app/apis/tenant';
import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

interface IAdminDashboard {
  selectedTenant: ITenant | undefined;
  handleNavigation: (url: string) => void;
  handleSelectTenant: (tenantData: ITenant | undefined) => void;
  searchComponent: JSX.Element;
}

const AdminDashboard: FC<IAdminDashboard> = (props: IAdminDashboard) => {
  const { selectedTenant, handleNavigation, handleSelectTenant, searchComponent } = props;

  const { inputSearch, handle } = useSearch();
  const { data, reload, isLoading } = useFetch<ITenant, {}>(list, inputSearch);

  const schema = yup.object().shape({
    name: yup.string().required('Tên không được để trống.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
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
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const [isOpenModal, setIsOpenModal] = useState(false);

  const onSubmit = async (data: { name: string }) => {
    try {
      const res = await create(data);

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
    setIsOpenModal(!isOpenModal);
    reset();
  };

  return selectedTenant ? (
    <div id="wrapper_selection">
      <p>
        Bạn đang chọn chi nhánh:
        <strong>{selectedTenant?.name}</strong>
      </p>

      <div
        className="button_select cursor-pointer"
        onClick={() => {
          handleNavigation(routersEndpoint.tenantManageMedicine.replace(':id', selectedTenant!.id.toString()));
        }}
      >
        Quản lý danh mục thuốc
      </div>

      {searchComponent}

      <div className="button_select cursor-pointer"> Quản lý người dùng </div>
    </div>
  ) : (
    <>
      <div id="wrapper_btn">
        <Button onClick={toggleModal}>Thêm mới</Button>
      </div>
      <div id="wrapper_tenant">
        <Table
          loading={isLoading}
          dataSource={(data?.statusCode === 'OK' && data.data.rows) || []}
          columns={columns}
          style={{ marginTop: 12 }}
          rowKey="id"
          rowClassName="cursor-pointer"
          scroll={{ x: 996 }}
          onRow={(record) => ({
            onClick: () => {
              handleSelectTenant(record);
            },
          })}
          pagination={{
            onChange: (page) => handle.handleChangePage(page - 1),
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
              <label htmlFor="username">Tên nhà thuốc</label>
              <input type="text" id="username" {...register('name')} />

              <span className="error-message">{errors.name ? errors.name.message : ''}</span>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default AdminDashboard;
