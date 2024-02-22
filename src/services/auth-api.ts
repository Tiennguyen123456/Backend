import { ILoginReq, ILoginRes, IResetPasswordReq, IUpdatePasswordReq } from "@/models/api/auth-api";
import { api } from "../configs/axios.config";
import ApiRoutes from "./api.routes";

const authApi = {
    login: (request: ILoginReq) => {
        return api.post<IResponse<ILoginRes>>(ApiRoutes.login, request);
    },
    resetPassword: (request: IResetPasswordReq) => {
        return api.post<IResponse<null>>(ApiRoutes.resetPassword, request);
    },
    updatePasswordWithToken: (token: string, request: IUpdatePasswordReq) => {
        let url = ApiRoutes.resetPassword + `/${token}`;

        return api.post<IResponse<null>>(url, request);
    },
};

export default authApi;
