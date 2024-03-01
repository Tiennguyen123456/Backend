import { api } from "@/configs/axios.config";
import ApiRoutes from "./api.routes";
import { ICampaignRes } from "@/models/api/campaign-api";

const campaignApi = {
    storeCampaign: async (body: any) => {
        return await api.post<IResponse<ICampaignRes>>(ApiRoutes.storeCampaign, body);
    },
};
export default campaignApi;
