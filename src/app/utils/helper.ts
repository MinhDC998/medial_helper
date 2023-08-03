import { TFailedRes } from '@ts/common/response';

export const combineEndpoint = (prefix: string, endpoint: string): string => `${prefix}/${endpoint}`;

export const randomString = (): string => (Math.random() + 1).toString(36).substring(2);

export const isFailedRes = (errRes: unknown): errRes is TFailedRes => (errRes as TFailedRes).statusCode !== undefined;
