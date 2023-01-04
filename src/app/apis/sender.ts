import axios, { AxiosResponse } from 'axios';

const sender = (): { get: any, post: any, put: any, del: any } => {
  const instance = axios.create({
    baseURL: 'http://localhost:3001',
  });

  const abortController = new AbortController();

  const t = false;

  if (t) instance.defaults.headers.common.Authorization = 'Bearer 123';

  const handleResponse = async (res: any): Promise<any> => new Promise((resolve, reject) => {
    if (res.status === 200 || res.status === 201) {
      if (res.data.statusCode) { resolve(res.data); return; }

      reject(res.data.message); return;
    }

    if (res.status !== 200) { reject(new Error(res.data.message)); return; }

    reject(new Error('Unknown Error'));
  });

  const handleError = async (error: any): Promise<any> => new Promise((resolve, reject) => {
    if (error?.response?.data) {
      reject(error.response.data);
      return;
    }

    reject(error);
  });

  const get = async (
    route: string,
    params?: Record<string, string | number>,
  ): Promise<AxiosResponse<any, any>> => instance
    .get(route, { params, signal: abortController.signal })
    .then(handleResponse)
    .catch(handleError);

  const post = async (
    route: string,
    payload: Record<string, any> = {},
  ): Promise<AxiosResponse<any, any>> => instance
    .post(route, { signal: abortController.signal }, payload)
    .then(handleResponse)
    .catch(handleError);

  const put = async (
    route: string,
    payload: Record<string, any>,
  ): Promise<AxiosResponse<any, any>> => instance
    .put(route, { signal: abortController.signal }, payload)
    .then(handleResponse)
    .catch(handleError);

  const del = async (route: string): Promise<AxiosResponse<any, any>> => instance
    .delete(route, { signal: abortController.signal })
    .then(handleResponse)
    .catch(handleError);

  return {
    get, post, put, del,
  };
};

export default sender;
