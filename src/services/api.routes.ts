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

    // Get role
    getRoles: baseURL + "/roles",

    getPermissions: baseURL + "/permissions",
};

export default ApiRoutes;
