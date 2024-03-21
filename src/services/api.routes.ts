const baseURL = process.env.NEXT_PUBLIC_API_URL;

const ApiRoutes = {
    // ** Auth Routes
    login: baseURL + "/login",
    resetPassword: baseURL + "/reset-password",

    // ** Profile Routes
    getProfile: baseURL + "/self",

    // ** Company Routes
    getCompanies: baseURL + "/companies",
    storeCompany: baseURL + "/company/store",
    deleteCompany: baseURL + "/company/",

    // ** Role Routes
    getRoles: baseURL + "/roles",
    storeRole: baseURL + "/role/store",
    deleteRole: baseURL + "/role/",

    // ** Account Routes
    getAccounts: baseURL + "/users",
    storeAccount: baseURL + "/user/store",
    deleteAccount: baseURL + "/user/",

    // ** Permission Routes
    getPermissions: baseURL + "/permissions",
    getPermissionByRole: baseURL + "/permission/role",
    assignPermission: baseURL + "/permission/assign",

    // ** Event Routes
    getEvents: baseURL + "/events",
    storeEvent: baseURL + "/event/store",
    getEventById: baseURL + "/event",
    updateCustomFieldsEvent: baseURL + "/event/",
    deleteCustomFieldsEvent: baseURL + "/event",
    getFieldBasic: baseURL + "/event/main-fields",
    scanQRCode: baseURL + "/event/qr-checkin",
    dashboardReport: baseURL + "/event/dashboard-report",

    // ** Client Routes
    getClientsByEvent: baseURL + "/event",
    importExcelClient: baseURL + "/event",
    storeClient: baseURL + "/event",
    deleteClient: baseURL + "/event",
    checkInClient: baseURL + "/event",
    downloadSampleExcel: baseURL + "/event/client/import-sample",
    generateQrCode: baseURL + "/generate-client-qrcode",

    // ** Campaign Routes
    getCampaigns: baseURL + "/campaigns",
    storeCampaign: baseURL + "/campaign/store",
    deleteCampaign: baseURL + "/campaign/",
    getCampaignById: baseURL + "/campaign/",
    handleAction: baseURL + "/campaign/$id/action",

    // ** Campaign Routes
    getLogSendEmailByCampaignId: baseURL + "/campaign/$campaignId/log-send-email",
};

export default ApiRoutes;
