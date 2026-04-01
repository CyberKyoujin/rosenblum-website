import axios from "axios";
import Cookies from "js-cookie"
import useAuthStore from "./useAuthStore";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json, text/plain, */*'
    }
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
            return Promise.reject({ status: null, message: "NETWORK_ERROR", errors: null });
        }

        const status = error.response.status;

        const isAuthEndpoint = originalRequest.url?.includes('/admin-user/login/') ||
                               originalRequest.url?.includes('/user/token-refresh/');

        if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;
            try {
                await axios.post(`${BASE_URL}/user/token-refresh/`, {}, { withCredentials: true });
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logoutUser();
                return Promise.reject({ status: 401, message: "TOKEN_REFRESH_FAILED", errors: null });
            }
        }

        return Promise.reject({
            status,
            message: error.response.data?.message ?? null,
            errors: error.response.data ?? null,
        });
    }
);

export default axiosInstance;
