const baseURL = process.env.NEXT_PUBLIC_API_URL;

const ApiRoutes = {
    // ** Auth Routes
    login: baseURL + "/login",

    // ** Profile Routes
    getProfile: baseURL + "/self",
};

export default ApiRoutes;
