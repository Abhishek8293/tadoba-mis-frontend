export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  timeStamp: string;
  success: boolean;
}
