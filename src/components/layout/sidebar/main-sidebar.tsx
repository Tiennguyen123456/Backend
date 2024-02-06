"use client";
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from "react-pro-sidebar";
import {
    BarChart,
    Building2,
    CalendarClock,
    LayoutDashboard,
    LockKeyhole,
    Megaphone,
    UserRoundCog,
    Users,
} from "lucide-react";
import sideBarConfig from "@/configs/SideBarConfig";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { SideBarItemType } from "@/models/SideBar";
import { getAppRoutesBaseOnPermission } from "@/helpers/funcs";
import { SidebarHeader } from "./sidebar-header";
import { SideBarGroup } from "./sidebar-group";

const menuItemStyles: MenuItemStyles = {
    root: {
        color: sideBarConfig.root.color,
        fontSize: sideBarConfig.root.fontSize,
        fontWeight: sideBarConfig.root.fontWeight,
    },
    icon: {
        color: sideBarConfig.icon.color,
        [`&.${menuClasses.disabled}`]: {
            color: sideBarConfig.icon.disabled,
        },
    },
    SubMenuExpandIcon: {
        color: sideBarConfig.SubMenuExpandIcon.color,
    },
    subMenuContent: ({ level }) => ({
        backgroundColor: level === 0 ? sideBarConfig.subMenuContent.backgroundColor : "transparent",
    }),
    button: {
        [`&.${menuClasses.disabled}`]: {
            color: sideBarConfig.button.disabled,
        },
        "&:hover": {
            backgroundColor: sideBarConfig.button.hover.backgroundColor,
            color: sideBarConfig.button.hover.color,
        },
    },
};

export const MainSidebar: React.FC = () => {
    // State
    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);

    // ** State
    const [userPermissions, SetUserPermissions] = useState<string[]>([
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
