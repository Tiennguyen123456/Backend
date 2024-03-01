import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";
import { IEventRes } from "@/models/api/event-api";

const eventApi = {
    storeEvent: async (body: any) => {
        return await api.post<IResponse<IEventRes>>(ApiRoutes.storeEvent, body);
    },
    getEventById: async (eventId: number) => {
        var url = ApiRoutes.getEventById + "/" + eventId;

        const response = await api.get<IResponse<IEventRes>>(url);

        return response.data;
    },
};
export default eventApi;
