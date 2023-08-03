export interface ISuccessResponse<D> {
  data: D;
  statusCode: 'OK';
}

export interface IFailedResponse {
  message: string;
  statusCode: 'FAILED' | 'invalidCredentials';
}

export interface IValidationError {
  message: Record<string, string[]>;
  statusCode: 'RequiredField';
}

export interface IListResponse<D> {
  data: { count: number; rows: D[] };
  statusCode: 'OK';
}

export interface IJwtFailed {
  message: string;
  statusCode: 'CredentialError';
}

export type TFailedRes = IFailedResponse | IValidationError | IJwtFailed;
export type TCommonResponse<D> = ISuccessResponse<D> | TFailedRes;
export type TCommonListResponse<D> = IListResponse<D> | IListResponse<D> | IFailedResponse | IValidationError;

export type TApiResponse<D> = Promise<TCommonResponse<D>>;
export type TApiListResponse<D> = Promise<TCommonListResponse<D>>;
