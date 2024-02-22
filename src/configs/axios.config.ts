import Cookies from "js-cookie";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const appKey = process.env.NEXT_PUBLIC_API_APP_KEY;

export const api = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
        Accept: "application/json",
        "App-Key": appKey,
    },
});

api.interceptors.response.use(
    function (response) {
        return response;
    },

    function (error) {
        const status = error.response?.status;

        if (status === 403) {
            window.location.href = "/403";
        }
        return Promise.reject(error);
    },
);

api.defaults.withCredentials = true;

api.defaults.headers.common["Authorization"] = Cookies.get("authorization")
    ? `Bearer ${Cookies.get("authorization")}`
    : null;

export const setAxiosAuthorization = (token: string) => {
    api.defaults.headers.common["Authorization"] = token && `Bearer ${token}`;
};
