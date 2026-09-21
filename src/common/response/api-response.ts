
export interface SuccessResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}
