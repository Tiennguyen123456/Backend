import { DeviceType } from "@/constants/enum";
import { create } from "zustand";
import useWindowSize from "./use-window-size";

interface useCommonProps {
    isSideBarCollapse: boolean;
    isSideBarToggle: boolean;
    deviceType: string;
    toggleCollapseSideBar: () => void;
    toggleSideBar: () => void;
    handleChangeDeviceType: (type: string) => void;
}

export const useCommon = create<useCommonProps>((set) => ({
    isSideBarCollapse: false,
    isSideBarToggle: false,
    deviceType: DeviceType.Desktop,
    toggleCollapseSideBar: () => set((state) => ({ isSideBarCollapse: !state.isSideBarCollapse })),
    toggleSideBar: () => set((state) => ({ isSideBarToggle: !state.isSideBarToggle, isSideBarCollapse: false })),
    handleChangeDeviceType: (type) =>
        set(() => ({
            deviceType: type,
            isSideBarToggle: false,
            isSideBarCollapse: type == DeviceType.Mobile || type == DeviceType.Tablet ? true : false,
        })),
}));
