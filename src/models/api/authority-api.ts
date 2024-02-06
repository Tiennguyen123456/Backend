export interface IRoleRes {
  id: number;
  name: string;
  guard_name: string;
  enable: number;
  is_hidden: number;
  created_at: string;
  updated_at: string;
}

export interface IPermissionRes {
  groupName: string;
  names: string[];
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}
