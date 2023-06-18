import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default {
  get(cookieName: string): any {
    return cookies.get(cookieName);
  },
  remove(cookieName: string): void {
    cookies.remove(cookieName, { path: '/' });
  },
  set<D>(data: D, cookieName: string): void {
    cookies.set(cookieName, data, { path: '/' });
  },
};
