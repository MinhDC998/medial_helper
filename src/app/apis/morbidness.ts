import sender from '@apis/sender';

import { ITenant } from '@ts/tenant';
import { TApiResponse } from '@ts/common/response';
import { ISearch } from '@ts/common/common';

import { combineEndpoint } from '@utils/helper';

const prefix = 'morbidness';

export const list = async (input: ISearch): TApiResponse<ITenant> => sender().get(prefix, input);
export const create = async (data: { name: string }): TApiResponse<ITenant> => sender().post(prefix, data);
