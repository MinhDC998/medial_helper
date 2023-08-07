import { IUser } from '@ts/user';
import * as cookieServices from '@services/cookies';
import { COMMON } from '@constants/common';

export const getUser = (): IUser => cookieServices.default.get(COMMON.COOKIE.USER);

export const logout = (): void => {
  cookieServices.default.remove(COMMON.COOKIE.USER);
  cookieServices.default.remove(COMMON.COOKIE.TENANT);
};

export const login = (user: IUser): void => {
  const checkUser = getUser();

  if (checkUser) logout();

  cookieServices.default.set<IUser>(user, COMMON.COOKIE.USER);
};
