"use client";
import { ICampaignRes } from "@/models/api/campaign-api";
import campaignApi from "@/services/campaign-api";
import { toastError } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CampaignForm from "./components/campaign-form";
import { ROUTES } from "@/constants/routes";
import { APIStatus, MessageCode } from "@/constants/enum";

export default function EditCampaignPage({ params }: { params: { id: number } }) {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // ** UseState
    const [data, setData] = useState<ICampaignRes>();
    const [loading, setLoading] = useState(true);

    const handleGetCampaignById = async () => {
        try {
            setLoading(true);
            if (params.id) {
                if (params.id) {
                    const response = await campaignApi.getCampaignById(params.id);
                    if (response.data.status === APIStatus.SUCCESS) {
                        const formData = response?.data.data;
                        setData(formData);
                    }
                }
            }
        } catch (error: any) {
            handleApiError(error);
            router.push(ROUTES.CAMPAIGNS);
        } finally {
            setLoading(false);
        }
    };

    const handleApiError = (error: any) => {
        const { response, code } = error;

        if (code == "ERR_NETWORK") {
            toastError(translation("errorApi.ERR_NETWORK"));
        } else if (response?.data?.message_code == MessageCode.VALIDATION_ERROR) {
            const [value] = Object.values(response.data.data);
            const message = Array(value).toString() ?? translation("errorApi.UNKNOWN_ERROR");
            toastError(message);
        } else {
            toastError(translation(`errorApi.${response?.data?.message_code ?? "UNKNOWN_ERROR"}`));
        }
    };

    useEffect(() => {
        handleGetCampaignById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return null;

    return (
        <>
            <CampaignForm data={data} />
        </>
    );
}
