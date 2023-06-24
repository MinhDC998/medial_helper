/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { ILoginInput, IUser } from '@ts/user';
// import { ISuccessResponse } from '@ts/common/response';
import { login as setUserCookie } from '@utils/user';
import routes from '@routers/routersEndpoint';

import ROLE from '@constants/role';

import './styles.scss';

const schema = yup.object().shape({
  username: yup.string().required('Tên đăng nhập không được để trống.'),
  password: yup.string().required('Mật khẩu không được để trống.'),
});

const sampleUsers: IUser[] = [
  {
    displayName: 'Normal User',
    password: 'user',
    role: ROLE.USER,
    username: 'user',
  },
  {
    displayName: 'Tenant User',
    password: 'tenant',
    role: ROLE.TENANT_USER,
    username: 'tenant',
  },
  {
    displayName: 'Admin User',
    password: 'admin',
    role: ROLE.ADMIN,
    username: 'admin',
  },
];

function Login() {
  const navigate = useNavigate();

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
    // const user = getUser();
    // if (user) history.
  }, []);

  const onSubmit = async (data: ILoginInput) => {
    try {
      // const result: ISuccessResponse<IUser> = await login(data);

      // if (result.statusCode !== 'OK') {
      //   setError('submitError', { type: 'custom', message: 'Wrong user name or password' });
      //   return;
      // }

      const user = sampleUsers.find((v) => v.password === data.password && v.username === data.username);

      if (!user) {
        setError('submitError', { type: 'custom', message: 'Sai tài khoản hoặc mật khẩu' });
        return;
      }

      setUserCookie(user);

      navigate(routes.home);

      // setUserCookie(result.data);

      // message.success('Login success');
      reset();
    } catch (err) {
      // message.error('Error!');
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
