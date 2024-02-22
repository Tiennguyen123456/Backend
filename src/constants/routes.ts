import { IRouterBreadcrumbs } from "@/models/Route";

export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    // EVENTS: "/events",
    // EVENTS_CREATE: "/events/create",
    // EVENTS_DETAILS: "/events/details",
    // EVENTS_CONFIG: "/events/config",
    // CAMPAIGNS: "/campaigns",
    // CAMPAIGNS_DETAILS: "/campaigns/details",
    // DATA: "/data",
    // TEMP_DATA_PAGE_1: "/data/temp-data-page-1",
    // TEMP_DATA_PAGE_2: "/data/temp-data-page-2",
    // REPORT: "/reports",
    // TEMP_REPORT_PAGE: "/reports/temp-report-page",
    COMPANIES: "/companies",
    COMPANY_CREATE: "/companies/create",
    // COMPANY_DETAILS: "/companies/details",
    // ACCOUNTS: "/accounts",
    // ROLES: "/roles",
    // PERMISSIONS: "/permissions",
    // LANGUAGES: "/languages",
    // CONFIGURATIONS: "/configurations",
    // CLIENTS: "/clients",
    403: "/403",
};

export const ROUTERS_BREADCRUMBS: IRouterBreadcrumbs[] = [
    {
        code: "home",
        name: "Home",
        slug: ROUTES.DASHBOARD,
    },
    // {
    //     name: "Events",
    //     slug: ROUTES.EVENTS,
    // },
    // {
    //     name: "Events Details",
    //     slug: ROUTES.EVENTS_DETAILS,
    // },
    // {
    //     name: "Create Event",
    //     slug: ROUTES.EVENTS_CREATE,
    // },
    // {
    //     name: "Config Event",
    //     slug: ROUTES.EVENTS_CONFIG,
    // },
    // {
    //     name: "Campaigns",
    //     slug: ROUTES.CAMPAIGNS,
    // },
    // {
    //     name: "Campaigns Details",
    //     slug: ROUTES.CAMPAIGNS_DETAILS,
    // },
    // {
    //     name: "Temp Data Page 1",
    //     slug: ROUTES.TEMP_DATA_PAGE_1,
    // },
    // {
    //     name: "Temp Data Page 2",
    //     slug: ROUTES.TEMP_DATA_PAGE_2,
    // },
    // {
    //     name: "Temp Report Page",
    //     slug: ROUTES.TEMP_REPORT_PAGE,
    // },
    {
        code: "company",
        name: "Company",
        slug: ROUTES.COMPANIES,
    },
    {
        code: "createCompany",
        name: "Create Company",
        slug: ROUTES.COMPANY_CREATE,
    },
    // {
    //     name: "Company Details",
    //     slug: ROUTES.COMPANY_DETAILS,
    // },
    // {
    //     name: "Accounts",
    //     slug: ROUTES.ACCOUNTS,
    // },
    // {
    //     name: "Roles",
    //     slug: ROUTES.ROLES,
    // },
    // {
    //     name: "Permissions",
    //     slug: ROUTES.PERMISSIONS,
    // },
    // {
    //     name: "Languages",
    //     slug: ROUTES.LANGUAGES,
    // },
    // {
    //     name: "Configurations",
    //     slug: ROUTES.CONFIGURATIONS,
    // },
    // {
    //     name: "Clients",
    //     slug: ROUTES.CLIENTS,
    // },
];

export const PRIVATE_ROUTES = [
    ROUTES.DASHBOARD,
    // ROUTES.EVENTS,
    // ROUTES.EVENTS_CREATE,
    // ROUTES.EVENTS_DETAILS,
    // ROUTES.EVENTS_CONFIG,
    // ROUTES.CAMPAIGNS,
    // ROUTES.CAMPAIGNS_DETAILS,
    // ROUTES.DATA,
    // ROUTES.TEMP_DATA_PAGE_1,
    // ROUTES.TEMP_DATA_PAGE_2,
    // ROUTES.REPORT,
    // ROUTES.TEMP_REPORT_PAGE,
    ROUTES.COMPANIES,
    ROUTES.COMPANY_CREATE,
    // ROUTES.ACCOUNTS,
    // ROUTES.ROLES,
    // ROUTES.PERMISSIONS,
    // ROUTES.LANGUAGES,
    // ROUTES.CONFIGURATIONS,
    // ROUTES.CLIENTS,
    ROUTES[403],
];

export const AppRoutesPermissions = [
    { path: ROUTES.LOGIN, permissions: [] },
    { path: ROUTES.DASHBOARD, permissions: [] },
    // { path: ROUTES.EVENTS, permissions: ["event:view", "event_asset:view"] },
    // { path: ROUTES.EVENTS_CREATE, permissions: [] },
    // { path: ROUTES.EVENTS_DETAILS, permissions: [] },
    // { path: ROUTES.EVENTS_CONFIG, permissions: [] },
    // { path: ROUTES.CAMPAIGNS, permissions: ["campaign:view"] },
    // { path: ROUTES.CAMPAIGNS_DETAILS, permissions: ["campaign:view"] },
    // { path: ROUTES.DATA, permissions: [] },
    // { path: ROUTES.TEMP_DATA_PAGE_1, permissions: [] },
    // { path: ROUTES.TEMP_DATA_PAGE_2, permissions: [] },
    // { path: ROUTES.REPORT, permissions: [] },
    // { path: ROUTES.TEMP_REPORT_PAGE, permissions: [] },
    { path: ROUTES.COMPANIES, permissions: ["company:view"] },
    { path: ROUTES.COMPANY_CREATE, permissions: ["company:create"] },
    // { path: ROUTES.ACCOUNTS, permissions: ["user:view"] },
    // { path: ROUTES.ROLES, permissions: ["user_role:view"] },
    // { path: ROUTES.PERMISSIONS, permissions: ["user_permission:view"] },
    // { path: ROUTES.LANGUAGES, permissions: ["language:view"] },
    // { path: ROUTES.CONFIGURATIONS, permissions: ["event:config"] },
    // { path: ROUTES.CLIENTS, permissions: [] },
    { path: ROUTES[403], permissions: [] },
];
