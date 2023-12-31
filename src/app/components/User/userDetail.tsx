/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Modal, message, Select, Button } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { isFailedRes } from '@utils/helper';

import * as cookie from '@services/cookies';
import { IRegisterInput } from '@ts/user';

import { create } from '@apis/user';

import { COMMON } from '@constants/common';
import ROLE from '@constants/role';

const UserModal = (props: { reload?: () => void }, ref: any) => {
  const { reload } = props;

  const schema = yup.object().shape({
    username: yup.string().required('Tên đăng nhập không được để trống.'),
    password: yup.string().required('Mật khẩu không được để trống.').min(6, 'Tối thiểu 6 kí tự'),
    displayName: yup.string().required('Tên không được để trống.'),
    role: yup.number().required('Quyền không được để trống.'),
    tenantId: yup.string().required('Nhà thuốc không được để trống.'),
  });
  const tenant = cookie.default.get(COMMON.COOKIE.TENANT);

  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<IRegisterInput>({
    // @ts-expect-error
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue('tenantId', tenant || null);
    setValue('role', ROLE.TENANT_USER || null);
  });

  const toggleModal = () => {
    reset();
    setIsOpen(!isOpen);
  };

  useImperativeHandle(ref, () => ({
    toggleModal,
  }));

  const onSubmit = async (data: IRegisterInput) => {
    try {
      const res = await create(data);

      switch (res.statusCode) {
        case 'OK':
          message.success('Thêm mới thành công');
          toggleModal();
          reset();

          reload && reload();

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

  return (
    <Modal
      title="Tạo tài khoản"
      open={isOpen}
      footer={[
        <Button onClick={toggleModal} key="cancel">
          Hủy bỏ
        </Button>,
        <Button form="userForm" key="submit" htmlType="submit" type="primary">
          Tạo mới
        </Button>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} id="userForm" className="form" style={{ margin: 0, padding: 0 }}>
        <div className={`form-group ${errors.username ? 'error-form-group' : ''}`}>
          <label htmlFor="username">Tên tài khoản</label>
          <input type="text" id="username" {...register('username')} />

          <span className="error-message">{errors.username ? errors.username.message : ''}</span>
        </div>

        <div className={`form-group ${errors.password ? 'error-form-group' : ''}`}>
          <label htmlFor="password">Mật khẩu</label>
          <input type="password" id="password" {...register('password')} />

          <span className="error-message">{errors.password ? errors.password.message : ''}</span>
        </div>

        <div className={`form-group ${errors.displayName ? 'error-form-group' : ''}`}>
          <label htmlFor="displayName">Tên</label>
          <input type="text" id="displayName" {...register('displayName')} />

          <span className="error-message">{errors.displayName ? errors.displayName.message : ''}</span>
        </div>

        <div className={`form-group ${errors.role ? 'error-form-group' : ''}`}>
          <label htmlFor="role">Quyền</label>
          <Select
            defaultValue={ROLE.TENANT_USER}
            style={{ width: '100%' }}
            options={[
              { id: ROLE.TENANT_USER, name: 'Quản lý nhà thuốc' },
              { id: ROLE.USER, name: 'Người dùng' },
            ]}
            fieldNames={{ value: 'id', label: 'name' }}
            id="role"
            onChange={(value) => {
              setValue('role', value);
            }}
          />

          <span className="error-message">{errors.role ? errors.role.message : ''}</span>
        </div>

        {/* <div className={`form-group ${errors.tenantId ? 'error-form-group' : ''}`}>
          <label htmlFor="tenantId">Nhà thuốc</label>

          <Select
            defaultValue={+tenant || null}
            style={{ width: '100%' }}
            options={tenants}
            id="tenantId"
            fieldNames={{ value: 'id', label: 'name' }}
            onChange={(value) => {
              setValue('tenantId', value);
            }}
          />

          <span className="error-message">{errors.tenantId ? errors.tenantId.message : ''}</span>
        </div> */}
      </form>
    </Modal>
  );
};

export default forwardRef(UserModal);
