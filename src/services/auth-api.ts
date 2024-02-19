import { ILoginReq, ILoginRes } from "@/models/api/auth-api";
import { api } from "../configs/axios.config";
import ApiRoutes from "./api.routes";

const authApi = {
    login: (request: ILoginReq) => {
        return api.post<IResponse<ILoginRes>>(ApiRoutes.login, request);
    },
};

export default authApi;
