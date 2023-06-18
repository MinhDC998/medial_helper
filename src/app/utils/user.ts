import { IUser } from '@ts/user';
import * as cookieServices from '@services/cookies';

const keyStorage = 'userStorageKey';

export const getUser = (): IUser => cookieServices.default.get(keyStorage);

export const logout = (): void => {
  cookieServices.default.remove(keyStorage);
};

export const login = (user: IUser): void => {
  const checkUser = getUser();

  if (checkUser) logout();

  cookieServices.default.set<IUser>(user, keyStorage);
};
