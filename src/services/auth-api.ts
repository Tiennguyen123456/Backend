import { ILoginReq, ILoginRes, IResetPasswordReq } from "@/models/api/auth-api";
import { api } from "../configs/axios.config";
import ApiRoutes from "./api.routes";

const authApi = {
    login: (request: ILoginReq) => {
        return api.post<IResponse<ILoginRes>>(ApiRoutes.login, request);
    },
    resetPassword: (request: IResetPasswordReq, token?: string) => {
        let url = ApiRoutes.resetPassword + (token ? `/${token}` : "");

        return api.post<IResponse<null>>(url, request);
    },
};

export default authApi;
