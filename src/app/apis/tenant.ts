import sender from '@apis/sender';

import { TApiResponse } from '@appTypes/common/response';
import { ITenant } from '@ts/tenant';
import { combineEndpoint } from '@utils/helper';

const prefix = 'tenants';

export const list = async (input: any): TApiResponse<ITenant> => sender().get(prefix, input);
export const create = async (data: any): TApiResponse<ITenant> => sender().post(prefix, data);
