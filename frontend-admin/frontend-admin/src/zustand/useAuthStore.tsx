import { create } from "zustand";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'
import { Cookie } from "@mui/icons-material";


interface AuthTokens {
    access: string;
    refresh: string;
}

interface User{
    id: number;
    email: string;
}

interface AuthState {
    authTokens: AuthTokens | null;
    isAuthenticated: boolean;
    user: User | null;
    loginError: boolean;
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
    loginError: false,

    setTokens: (tokens: AuthTokens) => {
        if (tokens){
            set({ authTokens: tokens, isAuthenticated: true, user: jwtDecode(tokens.access) as User });
        } else {
            set({ authTokens: null, isAuthenticated: false, user: null})
        }
    },

    setUser: (user) => set({ user }),

    loginUser: async (formData: FormData) => {
        try {
            const response = await axiosInstance.post('/admin-user/login/', formData);
            if (response.status === 200) {
                const { access, refresh } = response.data;
                const tokens: AuthTokens = { access, refresh}
                Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
                Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
                get().setTokens(tokens);
                window.location.href = '/dashboard';
            } else if (response.status === 403){
                set({loginError: true})
            }
        } catch (err) {
            console.error(err);
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