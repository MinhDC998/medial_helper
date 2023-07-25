import sender from '@apis/sender';

import { TApiResponse } from '@appTypes/common/response';
import { IUser } from '@ts/user';
import { combineEndpoint } from '@utils/helper';

const prefix = 'users';

export const login = async (input: any): TApiResponse<IUser> => sender().post(combineEndpoint(prefix, 'login'), input);
