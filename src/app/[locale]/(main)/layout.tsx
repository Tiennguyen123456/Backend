"use client";
import Cookies from "js-cookie";
import LoadingPage from "@/components/layout/loading-page";
import { MainSidebar } from "@/components/layout/sidebar/main-sidebar";
import TopBar from "@/components/layout/topbar";
import { DeviceType } from "@/constants/enum";
import { ScreenWidth } from "@/constants/variables";
import { useCommon } from "@/hooks/use-common";
import useWindowSize from "@/hooks/use-window-size";
import { useAppDispatch } from "@/redux/root/hooks";
import { getProfile } from "@/redux/user/action";
import { toastError } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    // ** State
    const [loading, setLoading] = useState(true);

    // ** Router
    const router = useRouter();

    // ** Custom Hook
    let screenWidth = useWindowSize();

    // ** I18n
    const translation = useTranslations();

    // ** Redux User
    const dispatch = useAppDispatch();

    // ** Common state
    const common = useCommon();

    // ** Function
    const handleChangeDeviceType = () => {
        if (screenWidth) {
            if (screenWidth < ScreenWidth.sm) {
                common.handleChangeDeviceType(DeviceType.Mobile);
            } else if (screenWidth >= ScreenWidth.sm && screenWidth <= ScreenWidth.lg) {
                common.handleChangeDeviceType(DeviceType.Tablet);
            } else {
                common.handleChangeDeviceType(DeviceType.Desktop);
            }
        }
    };

    const handleGetUserProfile = async () => {
        try {
            await dispatch(getProfile()).unwrap();
        } catch (error: any) {
            console.log("error: ", error);
            const data = error?.response?.data;
            if (data?.message_code) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(translation("errorApi.GET_USER_PROFILE_FAILED"));
            }
            // logout when get profile error
            Cookies.remove("authorization");
            Cookies.remove("userPermissions");
            router.push(ROUTES.LOGIN);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleChangeDeviceType();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screenWidth]);

    useEffect(() => {
        handleGetUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <LoadingPage />;

    return (
        <div className="flex h-dvh overflow-hidden">
            <MainSidebar />
            <div className="flex-col w-full">
                <TopBar />
                <div className="w-full h-topbar-desktop overflow-y-auto">
                    <div className="h-full flex-1 space-y-6 p-4 md:p-6 md:pt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
