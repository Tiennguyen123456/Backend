import qs from "qs";
import { api } from "@/configs/axios.config";
import { IListRes } from "@/models/DataTable";
import { ICompanyRes } from "@/models/api/company-api";
import ApiRoutes from "./api.routes";

const companyApi = {
    getCompanies: async (body: any) => {
        const response = await api.get<IResponse<IListRes<ICompanyRes>>>(ApiRoutes.getCompanies, {
            params: body,
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: "brackets" });
            },
        });
        return response.data;
    },
    storeCompany: async (body: any) => {
        return await api.post<IResponse<ICompanyRes>>(ApiRoutes.storeCompany, body);
    },
};
export default companyApi;
