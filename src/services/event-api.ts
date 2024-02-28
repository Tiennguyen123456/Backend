import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";
import { IEventRes } from "@/models/api/event-api";

const eventApi = {
    storeEvent: async (body: any) => {
        return await api.post<IResponse<IEventRes>>(ApiRoutes.storeEvent, body);
    },
};
export default eventApi;
