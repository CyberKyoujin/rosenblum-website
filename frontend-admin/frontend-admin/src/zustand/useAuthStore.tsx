import { create } from "zustand";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'
import { toApiError } from "../utils/toApiError";
import { ApiErrorResponse } from "../types/error";

interface AuthTokens {
    access: string;
    refresh: string;
}

interface User{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile_img_url: string;
}

interface AuthState {
    authTokens: AuthTokens | null;
    isAuthenticated: boolean;
    user: User | null;
    loginError: ApiErrorResponse | null;
    loginSuperuserError: ApiErrorResponse | null;
    loading: boolean;
    setTokens: (tokens: AuthTokens) => void;
    setUser: (user: User) => void;
    loginUser: (formData: FormData) => Promise<void>;
    logoutUser: () => void;
    refreshToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
    authTokens: null,
    isAuthenticated: false,
    user: null,
    loading: false,
    loginError: null,
    loginSuperuserError: null,

    setTokens: (tokens: AuthTokens) => {
        if (tokens){
            set({ authTokens: tokens, isAuthenticated: true, user: jwtDecode(tokens.access) as User });
        } else {
            set({ authTokens: null, isAuthenticated: false, user: null})
        }
    },

    setUser: (user) => set({ user }),

    loginUser: async (formData: FormData) => {

        set({ loginError: null, loginSuperuserError: null, loading: true });

        try {
            const response = await axiosInstance.post('/admin-user/login/', formData);
            
            const { access, refresh } = response.data;
            const tokens: AuthTokens = { access, refresh };

            Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' });
            Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
            
            get().setTokens(tokens);
            window.location.href = '/dashboard';

        } catch (err: unknown) {

            console.error('Login failed:', err);
            const apiError = toApiError(err);

            if (apiError.status === 401) {
            apiError.message = "E-Mail oder Passwort ist falsch";
        } else if (apiError.status === 403) {
            apiError.message = "Nur Admin-Nutzer können sich einloggen"; 
        }

            set({loginError: apiError});
        } finally {
            set({loading: false});
        }

    },

    logoutUser: () => {
        Cookies.remove('access', { secure: true, sameSite: 'Strict' });
        Cookies.remove('refresh', { secure: true, sameSite: 'Strict' });
        set({authTokens: null, user: null, isAuthenticated: false});
    },

    refreshToken: async () => {
        try{
            const refreshToken = Cookies.get('refresh');
            if (refreshToken) {
                const response = await axiosInstance.post('/user/token-refresh/', {'refresh': refreshToken});
                const {access, refresh} = response.data;
                const tokens: AuthTokens = {access, refresh}
                Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
                Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
                get().setTokens(tokens);
            } else {
                get().logoutUser();
                throw new Error('Refresh token not found!');
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    

}))

const initializeAuthState = () => {
    const accessToken = Cookies.get('access');
    const refreshToken = Cookies.get('refresh');
    if (accessToken && refreshToken) {
        const tokens: AuthTokens = { access: accessToken, refresh: refreshToken };
        useAuthStore.getState().setTokens(tokens);
        useAuthStore.getState().setUser(jwtDecode(accessToken) as User);
    }
};

initializeAuthState();

export default useAuthStore;