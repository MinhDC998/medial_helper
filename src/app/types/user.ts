import ROLE from '@constants/role';
import { ValueOf } from './common/common';

export interface IUser {
  username: string;
  password: string;
  displayName: string;
  role: ValueOf<typeof ROLE>;
}

export interface ILoginInput {
  username: string;
  password: string;
  submitError?: string;
}
