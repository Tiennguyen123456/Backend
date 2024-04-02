import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";
import { IPostRes } from "@/models/api/post-api";

const postApi = {
    storePost: async (formData: any) => {
        return await api.post<IResponse<IPostRes>>(ApiRoutes.storePost, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    getPostById: async (id: number) => {
        return await api.get<IResponse<IPostRes>>(ApiRoutes.getPostById.replace("$id", id.toString()));
    },
    deletePost: async (id: number) => {
        return await api.delete<IResponse<null>>(ApiRoutes.deletePost.replace("$id", id.toString()));
    },
    deleteBgImgPost: async (id: number) => {
        return await api.delete<IResponse<null>>(ApiRoutes.deleteBgImgPost.replace("$id", id.toString()));
    },
};
export default postApi;
