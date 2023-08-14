import sender from '@apis/sender';

import { TApiResponse } from '@ts/common/response';
import { ISearch } from '@ts/common/common';

import { combineEndpoint } from '@utils/helper';
import { IMedicine } from '@ts/medicine';

const prefix = 'medicines';

export const list = async (input: ISearch): TApiResponse<IMedicine> => sender().get(prefix, input);

export const listStatus = async (input: ISearch): TApiResponse<IMedicine> =>
  sender().get(combineEndpoint(prefix, 'list-status'), input);

export const create = async (data: { name: string }): TApiResponse<IMedicine> => sender().post(prefix, data);

export const importExcel = async (data: any): TApiResponse<IMedicine> =>
  sender().post(combineEndpoint(prefix, 'import-excel'), data);

export const update = async (id: number, data: IMedicine): TApiResponse<IMedicine> =>
  sender().post(combineEndpoint(prefix, id.toString()), data);

export const remove = async (id: number): TApiResponse<IMedicine> =>
  sender().del(combineEndpoint(prefix, id.toString()));
export const detail = async (id: number): TApiResponse<IMedicine> =>
  sender().get(combineEndpoint(prefix, id.toString()));
