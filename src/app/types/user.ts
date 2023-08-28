import ROLE from '@constants/role';
import { ValueOf } from './common/common';

export interface IUser {
  id: number;
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

export interface IRegisterInput extends Pick<IUser, 'displayName' | 'username' | 'password' | 'role' | 'tenantId'> {}
