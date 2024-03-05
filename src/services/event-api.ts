import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";
import { ICustomFields, IEventRes } from "@/models/api/event-api";

interface IResStoreCustomFields {
    collection: ICustomFields[];
}

const eventApi = {
    storeEvent: async (body: any) => {
        return await api.post<IResponse<IEventRes>>(ApiRoutes.storeEvent, body);
    },
    getEventById: async (eventId: number) => {
        var url = ApiRoutes.getEventById + "/" + eventId;
        const response = await api.get<IResponse<IEventRes>>(url);
        return response.data;
    },
    updateCustomFieldsEvent: async (eventId: any, body: any) => {
        var url = ApiRoutes.updateCustomFieldsEvent + eventId + "/custom-field/store";
        return await api.post<IResponse<IResStoreCustomFields>>(url, body);
    },
    deleteCustomFieldsEvent: async (customFieldId: any) => {
        var url = ApiRoutes.deleteCustomFieldsEvent + "/custom-field/" + customFieldId;
        return await api.delete<IResponse<IResStoreCustomFields>>(url);
    },
};
export default eventApi;
