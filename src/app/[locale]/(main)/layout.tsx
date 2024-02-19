"use client";
import { MainSidebar } from "@/components/layout/sidebar/main-sidebar";
import TopBar from "@/components/layout/topbar";
import { DeviceType } from "@/constants/enum";
import { ScreenWidth } from "@/constants/variables";
import { useCommon } from "@/hooks/use-common";
import useWindowSize from "@/hooks/use-window-size";
import { useEffect } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    // ** Custom Hook
    let screenWidth = useWindowSize();

    const common = useCommon();

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

    useEffect(() => {
        handleChangeDeviceType();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screenWidth]);

    return (
        <div className="flex h-dvh overflow-hidden">
            <MainSidebar />
            <div className="flex-col w-full">
                <TopBar />
                <div className="w-full h-topbar-desktop overflow-y-auto">
                    <div className="flex-1 space-y-6 p-4 md:p-6 md:pt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
