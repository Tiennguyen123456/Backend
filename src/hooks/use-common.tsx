import { DeviceType } from "@/constants/enum";
import { create } from "zustand";

interface useCommonProps {
    isSideBarCollapse: boolean;
    isSideBarToggle: boolean;
    deviceType: string;
    toggleCollapseSideBar: () => void;
    toggleSideBar: () => void;
    closeSideBar: () => void;
    handleChangeDeviceType: (type: string) => void;
}

export const useCommon = create<useCommonProps>((set) => ({
    isSideBarCollapse: false,
    isSideBarToggle: false,
    deviceType: DeviceType.Desktop,
    toggleCollapseSideBar: () => set((state) => ({ isSideBarCollapse: !state.isSideBarCollapse })),
    toggleSideBar: () => set((state) => ({ isSideBarToggle: !state.isSideBarToggle, isSideBarCollapse: false })),
    closeSideBar: () => set(() => ({ isSideBarToggle: false })),
    handleChangeDeviceType: (type) =>
        set(() => ({
            deviceType: type,
            isSideBarToggle: false,
            isSideBarCollapse: type == DeviceType.Mobile || type == DeviceType.Tablet ? true : false,
        })),
}));
