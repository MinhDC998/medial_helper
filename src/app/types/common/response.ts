export interface ISuccessResponse<D> {
  data: D
  statusCode: 'OK'
}

export interface IFailedResponse {
  message: string
  statusCode: 'FAILED'
}

export type TCommonResponse<D> = ISuccessResponse<D> | IFailedResponse;

export type TApiResponse<D> = Promise<TCommonResponse<D>>;
