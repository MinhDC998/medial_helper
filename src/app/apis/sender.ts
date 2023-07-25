import axios, { AxiosResponse } from 'axios';
import { getUser } from '@utils/user';
import * as cookie from '@services/cookies';
import { COMMON } from '@constants/common';

const sender = (): { get: any; post: any; put: any; del: any } => {
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
  });

  const abortController = new AbortController();

  const user = getUser();
  const tenant = cookie.default.get(COMMON.COOKIE.TENANT);

  if (user) instance.defaults.headers.common.Authorization = `Bearer ${user.token}`;
  if (tenant) instance.defaults.headers.common['tid'] = tenant.id;

  const handleResponse = async (res: any): Promise<any> =>
    new Promise((resolve, reject) => {
      if (res.status === 200 || res.status === 201) {
        if (res.data.statusCode) {
          resolve(res.data);
          return;
        }

        reject(res.data.message);
        return;
      }

      if (res.status !== 200) {
        reject(new Error(res.data.message));
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
    instance.put(route, { signal: abortController.signal }, payload).then(handleResponse).catch(handleError);

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
