import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";

const clientApi = {
    importExcelClient: async (eventId: number, formData: any) => {
        const url = ApiRoutes.importExcelClient + `/${eventId}/client/import`;
        return await api.post<IResponse<null>>(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    storeClient: async (eventId: number, body: any) => {
        const url = ApiRoutes.storeClient + `/${eventId}/client`;
        return await api.post<IResponse<null>>(url, body);
    },
    deleteClient: async (eventId: number, clientId: number) => {
        const url = ApiRoutes.deleteClient + `/${eventId}/client/${clientId}`;
        return await api.delete<IResponse<null>>(url);
    },
    checkInClient: async (eventId: number, clientId: any) => {
        const url = ApiRoutes.checkInClient + `/${eventId}/client/${clientId}/checkin`;
        return await api.post<IResponse<null>>(url);
    },
};
export default clientApi;
