export interface ISearch {
  offset: number;
  limit: number;
}

export type ValueOf<T> = T[keyof T];
