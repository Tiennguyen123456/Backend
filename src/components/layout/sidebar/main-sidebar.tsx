"use client";
import React, { useState } from "react";
import { Sidebar } from "react-pro-sidebar";
import sideBarConfig from "@/configs/SideBarConfig";
import { SideBarItemType } from "@/models/SideBar";
import { getAppRoutesBaseOnPermission } from "@/helpers/funcs";
import { SidebarHeader } from "./sidebar-header";
import { SideBarGroup } from "./sidebar-group";

export const MainSidebar: React.FC = () => {
    // State
    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);

    // ** State
    const [userPermissions, SetUserPermissions] = useState<string[]>([
        "user_role:view",
        "user_role:create",
        "user_role:assign-to-user",
        "user_permission:view",
        "user_permission:assign-to-role",
        "user_permission:revoke-from-role",
        "user:view",
        "user:create",
        "user:create-admin",
        "user:update",
        "user:update-admin",
        "user:delete",
        "system:view-history",
        "system:restore-default",
        "company:view",
        "company:create",
        "company:update",
        "company:assign-company",
        "company:delete",
        "event:view",
        "event:create",
        "event:update",
        "event:assign-company",
        "event:config",
        "event:delete",
        "event_asset:view",
        "event_asset:create",
        "event_asset:update",
        "event_asset:delete",
        "organizer:view",
        "organizer:create",
        "organizer:update",
        "organizer:import",
        "organizer:export",
        "client:view",
        "client:create",
        "client:update",
        "client:check-in",
        "client:import",
        "client:delete",
        "client:reset",
        "client:export",
        "checkin:view",
        "checkin:reset",
        "checkin:export",
        "export_log:view",
        "language:view",
        "language:create",
        "language:update",
        "language:define",
        "language:import-definition",
        "country:view",
        "country:update",
        "country:export",
        "campaign:view",
        "campaign:create",
        "campaign:update",
        "campaign:delete",
        "campaign:export",
        "email:view",
        "email:create",
        "email:update",
        "email:send",
        "email:delete",
        "label:view",
        "label:create",
        "label:update",
        "label:delete",
        "card:view",
        "card:create",
        "card:update",
        "card:delete",
    ]);
    const [appRoutes, setAppRoutes] = useState<SideBarItemType[]>(getAppRoutesBaseOnPermission(userPermissions));
    console.log(appRoutes);

    return (
        <div
            className="flex h-full"
            style={{ direction: "ltr" }}
        >
            <Sidebar
                collapsed={collapsed}
                toggled={toggled}
                onBackdropClick={() => setToggled(false)}
                breakPoint="md"
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
                                collapsed={collapsed}
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
