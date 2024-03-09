import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";
import { ICampaignRes } from "@/models/api/campaign-api";

const campaignApi = {
    storeCampaign: async (body: any) => {
        return await api.post<IResponse<ICampaignRes>>(ApiRoutes.storeCampaign, body);
    },
    getCampaignById: async (id: number) => {
        return await api.get<IResponse<ICampaignRes>>(ApiRoutes.getCampaignById + id);
    },
    deleteCampaign: async (id: number) => {
        return await api.delete<IResponse<null>>(ApiRoutes.deleteCampaign + id);
    },
};
export default campaignApi;
