import sender from '@apis/sender';

import { ITenant } from '@ts/tenant';
import { TApiResponse } from '@ts/common/response';
import { ISearch } from '@ts/common/common';

import { combineEndpoint } from '@utils/helper';

const prefix = 'tenants';

export const list = async (input: ISearch): TApiResponse<ITenant> => sender().get(prefix, input);
export const listAll = async (): TApiResponse<ITenant[]> => sender().get(combineEndpoint(prefix, 'all'));
export const create = async (data: { name: string }): TApiResponse<ITenant> => sender().post(prefix, data);
export const update = async (id: number, data: ITenant): TApiResponse<ITenant> =>
  sender().put(combineEndpoint(prefix, id.toString()), data);
export const remove = async (id: number): TApiResponse<ITenant> => sender().del(combineEndpoint(prefix, id.toString()));
