import qs from "qs";
import { api } from "@/configs/axios.config";
import { IListRes } from "@/models/DataTabel";
import ApiRoutes from "./api.routes";
import { IRoleRes } from "@/models/api/role-api";

const roleApi = {
    getList: async (body: any) => {
        const response = await api.get<IResponse<IListRes<IRoleRes>>>(ApiRoutes.getRoles, {
            params: body,
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: "brackets" });
            },
        });
        return response.data;
    },
};
export default roleApi;
