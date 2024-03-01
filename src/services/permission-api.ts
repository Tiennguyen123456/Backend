import qs from "qs";
import { api } from "@/configs/axios.config";
import { IListRes } from "@/models/DataTable";
import ApiRoutes from "./api.routes";
import { IRoleRes } from "@/models/api/role-api";
import { ICollectionRoleRes, IPermissionRoleRes } from "@/models/api/permission-api";

const permissionApi = {
    getList: async (body: any) => {
        const response = await api.get<IResponse<IListRes<IRoleRes>>>(ApiRoutes.getPermissions, {
            params: body,
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: "brackets" });
            },
        });
        return response.data;
    },
    getPermissionByRoleId: async (roleId: number) => {
        var url = ApiRoutes.getPermissionByRole + "/" + roleId;

        const response = await api.get<IResponse<IPermissionRoleRes<ICollectionRoleRes>>>(url);

        return response.data;
    },
    assignPermission: async (body: any) => {
        const response = await api.post<IResponse<null>>(ApiRoutes.assignPermission, body);
        return response.data;
    },
};
export default permissionApi;
