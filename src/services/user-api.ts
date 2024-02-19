import { api } from "../configs/axios.config";
import { IUserProfile } from "../models/User";
import ApiRoutes from "./api.routes";

const userApi = {
    getProfile: async () => {
        const response = await api.get<IResponse<IUserProfile>>(ApiRoutes.getProfile);
        return response.data.data;
    },
};

export default userApi;
