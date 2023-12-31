import axios, { AxiosResponse } from 'axios';

import { getUser, logout } from '@utils/user';
import * as routes from '@routers/routersEndpoint';
import * as cookie from '@services/cookies';

import { TCommonResponse } from '@ts/common/response';
import { COMMON } from '@constants/common';

const sender = (): { get: any; post: any; put: any; del: any } => {
  const instance = axios.create({
    // @ts-expect-error
    baseURL: import.meta.env.VITE_BASE_URL || '',
  });

  const abortController = new AbortController();

  const user = getUser();
  const tenant = cookie.default.get(COMMON.COOKIE.TENANT);

  if (user) instance.defaults.headers.common.Authorization = `Bearer ${user.token}`;
  if (user?.tenantId || tenant) instance.defaults.headers.common.tid = user.tenantId ?? tenant;

  const handleResponse = async (res: AxiosResponse<TCommonResponse<any>>): Promise<any> =>
    new Promise((resolve, reject) => {
      if (res.status === 200 || res.status === 201) {
        switch (res.data.statusCode) {
          case 'OK': {
            resolve(res.data);
            return;
          }

          case 'CredentialError':
            logout();
            window.location.href = routes.default.login;
            break;
          default:
            reject(res.data);
        }

        return;
      }

      reject(new Error('Unknown Error'));
    });

  const handleError = async (error: any): Promise<any> =>
    new Promise((resolve, reject) => {
      if (error?.response?.data) {
        reject(error.response.data);
        return;
      }

      reject(error);
    });

  const get = async (route: string, params?: Record<string, string | number>): Promise<AxiosResponse<any, any>> =>
    instance.get(route, { params, signal: abortController.signal }).then(handleResponse).catch(handleError);

  const post = async (route: string, payload: Record<string, any> = {}): Promise<AxiosResponse<any, any>> =>
    instance.post(route, payload, { signal: abortController.signal }).then(handleResponse).catch(handleError);

  const put = async (route: string, payload: Record<string, any>): Promise<AxiosResponse<any, any>> =>
    instance.put(route, payload, { signal: abortController.signal }).then(handleResponse).catch(handleError);

  const del = async (route: string): Promise<AxiosResponse<any, any>> =>
    instance.delete(route, { signal: abortController.signal }).then(handleResponse).catch(handleError);

  return {
    get,
    post,
    put,
    del,
  };
};

export default sender;
