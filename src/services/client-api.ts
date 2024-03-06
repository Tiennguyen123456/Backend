import { config } from "./../middleware";
import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";
import { AxiosRequestConfig } from "axios";

const clientApi = {
    importExcelClient: async (eventId: number, formData: any) => {
        const url = ApiRoutes.importExcelClient + `/${eventId}/client/import`;
        return await api.post<IResponse<null>>(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
export default clientApi;
