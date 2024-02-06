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
import { SideBarItemType } from "../models/SideBar";
import { ROUTES } from "./routes";

export const AppRoutes: SideBarItemType[] = [
    {
        path: ROUTES.DASHBOARD,
        key: "dashboard",
        sideBarProps: {
            displayText: "sidebar.items.dashboard",
            icon: <LayoutDashboard />,
        },
        permissions: [],
    },
    {
        key: "activity",
        permissions: [],
        group: {
            name: "sidebar.groups.activity",
            child: [
                {
                    path: ROUTES.EVENTS,
                    key: "activity.events",
                    sideBarProps: {
                        displayText: "sidebar.items.events",
                        icon: <CalendarClock />,
                    },
                    permissions: ["event:view", "event_asset:view"],
                },
                {
                    path: ROUTES.CAMPAIGNS,
                    key: "activity.campaigns",
                    sideBarProps: {
                        displayText: "sidebar.items.campaigns",
                        icon: <Megaphone />,
                    },
                    permissions: ["campaign:view"],
                },
                {
                    path: ROUTES.DATA,
                    key: "activity.data",
                    permissions: [],
                    sideBarProps: {
                        displayText: "sidebar.items.data",
                        icon: <BarChart />,
                    },
                    child: [
                        {
                            path: ROUTES.TEMP_DATA_PAGE_1,
                            key: "activity.data.tempDataPage1",
                            sideBarProps: {
                                displayText: "sidebar.items.tempDataPage1",
                            },
                            permissions: [],
                        },
                        {
                            path: ROUTES.TEMP_DATA_PAGE_2,
                            key: "activity.data.tempDataPage2",
                            sideBarProps: {
                                displayText: "sidebar.items.tempDataPage2",
                            },
                            permissions: [],
                        },
                    ],
                },
                {
                    path: ROUTES.REPORT,
                    key: "activity.reports",
                    permissions: [],

                    sideBarProps: {
                        displayText: "sidebar.items.reports",
                        icon: <BarChart />,
                    },
                    child: [
                        {
                            path: ROUTES.TEMP_REPORT_PAGE,
                            key: "activity.data.tempReportPage",
                            sideBarProps: {
                                displayText: "sidebar.items.tempReportPage",
                            },
                            permissions: [],
                        },
                    ],
                },
            ],
        },
    },
    {
        key: "administration",
        permissions: [],
        group: {
            name: "sidebar.groups.administration",
            child: [
                {
                    key: "administration.companies",
                    permissions: ["company:view"],
                    path: ROUTES.COMPANIES,
                    sideBarProps: {
                        displayText: "sidebar.items.companies",
                        icon: <Building2 />,
                    },
                },
                {
                    key: "administration.accounts",
                    permissions: ["user:view"],
                    path: ROUTES.ACCOUNTS,
                    sideBarProps: {
                        displayText: "sidebar.items.accounts",
                        icon: <Users />,
                    },
                },
                {
                    key: "administration.roles",
                    permissions: ["user_role:view"],
                    path: ROUTES.ROLES,
                    sideBarProps: {
                        displayText: "sidebar.items.roles",
                        icon: <UserRoundCog />,
                    },
                },
                {
                    key: "administration.permissions",
                    permissions: ["user_permission:view"],
                    path: ROUTES.PERMISSIONS,
                    sideBarProps: {
                        displayText: "sidebar.items.permissions",
                        icon: <LockKeyhole />,
                    },
                },
            ],
        },
    },
    {
        key: "setting",
        permissions: [],
        // group: {
        //     name: "sidebar.groups.setting",
        //     child: [
        //         {
        //             key: "setting.languages",
        //             permissions: ["language:view"],
        //             path: ROUTES.LANGUAGES,
        //             sideBarProps: {
        //                 displayText: "sidebar.items.languages",
        //                 icon: <GTranslateIcon />,
        //             },
        //         },
        //         {
        //             key: "setting.configurations",
        //             permissions: ["event:config"],
        //             path: ROUTES.CONFIGURATIONS,
        //             sideBarProps: {
        //                 displayText: "sidebar.items.configurations",
        //                 icon: <SettingsSuggestIcon />,
        //             },
        //         },
        //     ],
        // },
    },
];
