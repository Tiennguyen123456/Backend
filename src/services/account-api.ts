import { api } from "@/configs/axios.config";
import { IAccountRes } from "@/models/api/account-api";
import ApiRoutes from "./api.routes";

const accountApi = {
    storeAccount: async (body: any) => {
        const response = await api.post<IResponse<IAccountRes>>(ApiRoutes.storeAccount, body);
        return response;
    },
};

export default accountApi;
