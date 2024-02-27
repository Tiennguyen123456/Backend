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

    // ** Accout Routes
    getAccounts: baseURL + "/users",
    storeAccount: baseURL + "/user/store",
    deleteAccout: baseURL + "/user/",

    // ** Permission Routes
    getPermissions: baseURL + "/permissions",
    getPermissionByRole: baseURL + "/permission/role",
    assignPermission: baseURL + "/permission/assign",
};

export default ApiRoutes;
