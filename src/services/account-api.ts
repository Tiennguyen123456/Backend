import { api } from "@/configs/axios.config";
import { IAccountRes } from "@/models/api/account-api";
import ApiRoutes from "./api.routes";

const accountApi = {
    storeAccout: async (body: any) => {
        const response = await api.post<IResponse<IAccountRes>>(ApiRoutes.storeAccout, body);
        return response.data;
    },
};

export default accountApi;
