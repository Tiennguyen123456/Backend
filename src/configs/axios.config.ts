"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { ROUTES } from "@/constants/routes";

const { LOGIN } = ROUTES;
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const appKey = process.env.NEXT_PUBLIC_API_APP_KEY;
const userAgent = process.env.NEXT_PUBLIC_API_USER_AGENT;

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    Accept: "application/json",
    "App-Key": appKey,
    // "User-Agent": userAgent,
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

api.defaults.headers.common["Authorization"] = Cookies.get("authorization")
  ? `Bearer ${Cookies.get("authorization")}`
  : null;

api.defaults.withCredentials = true;

export const setAxiosAuthorization = (token: string) => {
  api.defaults.headers.common["Authorization"] = token && `Bearer ${token}`;
};
