/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { ILoginInput } from '@ts/user';

import { getUser, login as setUserCookie } from '@utils/user';
import routes from '@routers/routersEndpoint';
import { login } from '@apis/user';

import './styles.scss';
import routersEndpoint from '@routers/routersEndpoint';
import { isFailedRes } from '@/app/utils/helper';

function Login() {
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup.string().required('Tên đăng nhập không được để trống.'),
    password: yup.string().required('Mật khẩu không được để trống.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ILoginInput>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    const user = getUser();
    if (user) navigate(routersEndpoint.home);
  }, []);

  const onSubmit = async (data: ILoginInput) => {
    try {
      const user = await login(data);

      if (user.statusCode === 'OK') {
        setUserCookie(user.data);
        navigate(routes.home);
        reset();
      }
    } catch (err) {
      if (isFailedRes(err)) {
        switch (err.statusCode) {
          case 'invalidCredentials':
          case 'FAILED':
            setError('submitError', { type: 'custom', message: err.message });
            return;

          case 'RequiredField':
            Object.keys(err.message).forEach((v: any) => {
              // @ts-ignore
              setError(v, { type: 'custom', message: err.message[v][0] });
            });
            return;
        }
      }

      throw new Error('Đã xảy ra lỗi');
    }
  };

  return (
    <div id="wrapper_login">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className={`form-group ${errors.username ? 'error-form-group' : ''}`}>
          <label htmlFor="username">Tên đăng nhập</label>
          <input type="text" id="username" {...register('username')} />

          <span className="error-message">{errors.username ? errors.username.message : ''}</span>
        </div>

        <div className={`form-group ${errors.password ? 'error-form-group' : ''}`}>
          <label htmlFor="password">Mật khẩu</label>
          <input type="password" id="password" {...register('password')} />

          <span className="error-message">{errors.password ? errors.password.message : ''}</span>
        </div>

        <span className="error-message mb-24">{errors.submitError ? errors.submitError.message : ''}</span>

        <div id="form-footer">
          <input type="submit" id="confirm-btn" value="Đăng nhập" />
        </div>
      </form>
    </div>
  );
}

export default Login;
