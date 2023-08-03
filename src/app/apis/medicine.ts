import sender from '@apis/sender';

import { TApiResponse } from '@ts/common/response';
import { ISearch } from '@ts/common/common';

import { combineEndpoint } from '@utils/helper';
import { IMedicine } from '@ts/medicine';

const prefix = 'medicines';

export const list = (input: ISearch): TApiResponse<IMedicine> => sender().get(prefix, input);
export const create = (data: { name: string }): TApiResponse<IMedicine> => sender().post(prefix, data);

export const importExcel = (data: any): TApiResponse<IMedicine> =>
  sender().post(combineEndpoint(prefix, 'import-excel'), data);

export const update = (id: number, data: IMedicine): TApiResponse<IMedicine> =>
  sender().post(combineEndpoint(prefix, id.toString()), data);

export const remove = (id: number): TApiResponse<IMedicine> => sender().del(combineEndpoint(prefix, id.toString()));
export const detail = (id: number): TApiResponse<IMedicine> => sender().get(combineEndpoint(prefix, id.toString()));
