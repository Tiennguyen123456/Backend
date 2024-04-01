"use client";
import StorePostPageComponent from "../components/store-post-page";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/layout/loading-page";
import { IPostRes } from "@/models/api/post-api";
import postApi from "@/services/post-api";
import { APIStatus, MessageCode } from "@/constants/enum";
import { ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toastError } from "@/utils/toast";

interface UpdatePostPageProps {
    params: {
        id: number;
        landingPageId: number;
    };
}
export default function UpdatePostPage({ params }: UpdatePostPageProps) {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    const [data, setData] = useState<IPostRes>();
    const [loading, setLoading] = useState(true);

    const handleGetPostById = async () => {
        try {
            setLoading(true);
            if (params.id) {
                if (params.id) {
                    const response = await postApi.getPostById(params.id);
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
        handleGetPostById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <LoadingPage />;

    return (
        <>
            <StorePostPageComponent defaultData={data} />
        </>
    );
}
