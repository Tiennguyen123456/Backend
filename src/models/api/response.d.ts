declare interface IResponse<T> {
  status: string;
  status_code: number;
  message_code: string;
  message: string;
  data: T;
}

declare interface IPermissionResponse {
  status: string;
  status_code: number;
  message_code: string;
  message: string;
  data: string[];
}

declare interface IRoleResponse {
  status: string;
  status_code: number;
  message_code: string;
  message: string;
  data: string[];
}
