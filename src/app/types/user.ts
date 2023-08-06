import ROLE from '@constants/role';
import { ValueOf } from './common/common';

export interface IUser {
  username: string;
  password: string;
  displayName: string;
  role: ValueOf<typeof ROLE>;
  token: string;
  tenantId?: number;
}

export interface ILoginInput {
  username: string;
  password: string;
  submitError?: string;
}
