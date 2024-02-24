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
};

export default authorityApi;
