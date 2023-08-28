import sender from '@apis/sender';

import { TApiResponse } from '@appTypes/common/response';
import { IUser } from '@ts/user';
import { combineEndpoint } from '@utils/helper';
import { ISearch } from '../types/common/common';

const prefix = 'users';

export const login = async (input: any): TApiResponse<IUser> => sender().post(combineEndpoint(prefix, 'login'), input);
export const list = async (input: ISearch): TApiResponse<IUser> => sender().get(prefix, input);
export const listAll = async (): TApiResponse<IUser[]> => sender().get(combineEndpoint(prefix, 'all'));

export const update = async (data: any): TApiResponse<IUser[]> =>
  sender().post(combineEndpoint(prefix, data.id.toString()), data);

export const usersTenant = async (tenantId?: number): TApiResponse<IUser[]> =>
  sender().get(combineEndpoint(prefix, 'users-tenant'), { tenantId });

export const create = async (input: any): TApiResponse<IUser> =>
  sender().post(combineEndpoint(prefix, 'create'), input);
