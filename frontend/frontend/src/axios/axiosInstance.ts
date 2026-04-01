import axios from "axios";
import Cookies from "js-cookie"
import useAuthStore from "../zustand/useAuthStore";
import { ApiError } from "../types/auth";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    config => {
        const csrfToken = Cookies.get('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {

        const originalRequest = error.config;

        if (!error.response) {

            const apiError: ApiError = {
                status: null,
                message: "NETWORK_ERROR",
                errors: null,
            };

            return Promise.reject(apiError);
        }

        const status = error.response.status;

        const isAuthEndpoint = originalRequest.url?.includes('/user/login/') ||
                               originalRequest.url?.includes('/user/token-refresh/');

        if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {

            originalRequest._retry = true;

            
                try {

                    await axios.post(`${BASE_URL}/user/token-refresh/`, {}, { withCredentials: true });

                    return axiosInstance(originalRequest);

                } catch (refreshError) {

                    console.error("Token refresh failed:", refreshError);
                    useAuthStore.getState().logoutUser();

                    const apiError: ApiError = {
                        status: 401,
                        message: "TOKEN_REFRESH_FAILED",
                        errors: null,
                    };

                    return Promise.reject(apiError);

                }

        }

        const apiError: ApiError = {
            status,
            message: error.response.data?.message ?? null,
            errors: error.response.data ?? null,
        };

        return Promise.reject(apiError);

    }
);

export default axiosInstance;