"use client";
import React, { useEffect, useState } from "react";
import { Sidebar } from "react-pro-sidebar";
import sideBarConfig from "@/configs/SideBarConfig";
import { SideBarItemType } from "@/models/SideBar";
import { getAppRoutesBaseOnPermission } from "@/helpers/funcs";
import { SidebarHeader } from "./sidebar-header";
import { SideBarGroup } from "./sidebar-group";
import { useCommon } from "@/hooks/use-common";
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";

export const MainSidebar: React.FC = () => {
    // ** Common State
    const common = useCommon();

    // ** State
    const { userPermissions } = useAppSelector(selectUser);
    const [appRoutes, setAppRoutes] = useState<SideBarItemType[]>(getAppRoutesBaseOnPermission(userPermissions));

    return (
        <div className="flex h-full">
            <Sidebar
                collapsed={common.isSideBarCollapse}
                toggled={common.isSideBarToggle}
                onBackdropClick={common.toggleSideBar}
                customBreakPoint="920px"
                backgroundColor={sideBarConfig.mainBg}
            >
                <div className="flex flex-col h-full">
                    {/* LOGO */}
                    <SidebarHeader className="my-4 p-0" />

                    <div className="flex-1 mb-8">
                        {appRoutes.map((route) => (
                            <SideBarGroup
                                key={route.key}
                                item={route}
                                collapsed={common.isSideBarCollapse}
                            />
                        ))}
                        {/* <Menu menuItemStyles={menuItemStyles}>
                            <MenuItem icon={<LayoutDashboard />}>Dashboard</MenuItem>
                        </Menu>

                        <div className={cn("py-0 px-6 mb-2 mt-3 uppercase", sideBarConfig.group.color)}>
                            <h4 style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}>Activity</h4>
                        </div>
                        <Menu menuItemStyles={menuItemStyles}>
                            <MenuItem icon={<CalendarClock />}>Events</MenuItem>
                        </Menu>
                        <Menu menuItemStyles={menuItemStyles}>
                            <MenuItem icon={<Megaphone />}>Campaigns</MenuItem>
                        </Menu>
                        <Menu menuItemStyles={menuItemStyles}>
                            <SubMenu
                                label="Reports"
                                icon={<BarChart />}
                            >
                                <MenuItem> Report 1</MenuItem>
                                <MenuItem> Report 2</MenuItem>
                            </SubMenu>
                        </Menu>

                        <div className={cn("py-0 px-6 mb-2 mt-3 uppercase", sideBarConfig.group.color)}>
                            <h4 style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}>Administration</h4>
                        </div>
                        <Menu menuItemStyles={menuItemStyles}>
                            <MenuItem icon={<Building2 />}>Companies</MenuItem>
                            <MenuItem icon={<Users />}>Accounts</MenuItem>
                            <MenuItem icon={<UserRoundCog />}>Roles</MenuItem>
                            <MenuItem icon={<LockKeyhole />}>Permissions</MenuItem>
                        </Menu> */}
                    </div>
                </div>
            </Sidebar>
        </div>
    );
};
