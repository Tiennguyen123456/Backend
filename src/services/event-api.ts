import qs from "qs";
import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";
import { ICustomFields, IDashboardReportRes, IEventRes, IResFieldBasic } from "@/models/api/event-api";

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
    getFieldBasic: async () => {
        var url = ApiRoutes.getFieldBasic;
        const response = await api.get<IResponse<IResFieldBasic>>(url);
        return response.data;
    },
    scanQRCode: async (body: any) => {
        var url = ApiRoutes.scanQRCode;
        const response = await api.post<IResponse<null>>(url, body);
        return response.data;
    },
    dashboardReport: async (body: any) => {
        var url = ApiRoutes.dashboardReport;
        const response = await api.get<IResponse<IDashboardReportRes>>(url, {
            params: body,
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: "brackets" });
            },
        });
        return response.data;
    },
};
export default eventApi;
