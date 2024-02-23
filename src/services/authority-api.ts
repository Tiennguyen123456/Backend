import { IPermissionRes, IRoleRes } from "@/models/api/authority-api";
import { api } from "../configs/axios.config";
import ApiRoutes from "./api.routes";
import { IListRes } from "@/models/DataTable";

export const authorityApi = {
  /* Permissions Api */
  getPermissions: async (paginate: number) => {
    const url = ApiRoutes.getPermissions + `?pageSize=${paginate}`;
    const response = await api.get<IResponse<IListRes<IPermissionRes>>>(url);
    return response.data.data;
  },

  getPermissionsFromRole: async (id: number) => {
    const response = await api.get<IPermissionResponse>(ApiRoutes.getPermissionsFromRole + id);
    return response.data.data;
  },

  updatePermissions: async (model: any) => {
    const response = await api.post<IResponse<IPermissionResponse>>(ApiRoutes.updatePermissions, model);
    return response.data;
  },

  revokePermissions: async (roleId: number, model: any) => {
    const response = await api.delete<IResponse<IPermissionResponse>>(ApiRoutes.revokePermissions + roleId, model);
    return response.data.data;
  },

  /* Roles Api */
  getRoles: async () => {
    const response = await api.get<IResponse<IListRes<IRoleRes>>>(ApiRoutes.getRoles);
    return response.data.data;
  },

  getRolesWithParams: async (model: any) => {
    const response = await api.get<IResponse<IListRes<IRoleRes>>>(ApiRoutes.getRoles, {
      params: model,
    });
    return response.data.data;
  },

  storeRole: async (body: any) => {
    const response = await api.post<IResponse<IRoleRes>>(ApiRoutes.storeRole, body);
    return response.data;
  },
};

export default authorityApi;
