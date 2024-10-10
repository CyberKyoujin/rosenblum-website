import axios from "axios";
import Cookies from "js-cookie"
import useAuthStore from "./useAuthStore";

const BASE_URL = "http://127.0.0.1:8000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json, text/plain, */*'
    }
});

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = Cookies.get('access');
        if (accessToken) {
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
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get('refresh');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${BASE_URL}/user/token-refresh/`, { refresh: refreshToken });
                    const { access, refresh } = response.data;
                    Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); // 5 minutes
                    Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
                    axiosInstance.defaults.headers.Authorization = `Bearer ${access}`;
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    useAuthStore.getState().setTokens({ access, refresh });
                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    useAuthStore.getState().logoutUser();
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;