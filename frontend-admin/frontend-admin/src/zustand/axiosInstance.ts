import axios from "axios";
import Cookies from "js-cookie"
import useAuthStore from "./useAuthStore";

const BASE_URL =  import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json, text/plain, */*'
    }
});

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = Cookies.get('access');

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 && 
            originalRequest && 
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get('refresh');

            if (refreshToken) {
                try {
                    const response = await axios.post(`${BASE_URL}/user/token-refresh/`, { 
                        refresh: refreshToken 
                    });

                    const { access, refresh } = response.data;

                    Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' });
                    Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });

                    useAuthStore.getState().setTokens({ access, refresh });

                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;

                    return axiosInstance(originalRequest);

                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    useAuthStore.getState().logoutUser();
                    return Promise.reject(refreshError);
                }
            } else {
                useAuthStore.getState().logoutUser();
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;