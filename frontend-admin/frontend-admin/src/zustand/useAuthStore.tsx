import { create } from "zustand";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'
import { toApiError } from "../utils/toApiError";


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
    loginError: boolean;
    loginSuperuserError: boolean;
    setTokens: (tokens: AuthTokens) => void;
    setUser: (user: User) => void;
    loginUser: (formData: FormData) => Promise<void>;
    logoutUser: () => void;
    refreshToken: () => Promise<void>;
    setLoginError: () => void;
    setSuperuserError: () => void;
}



const useAuthStore = create<AuthState>((set, get) => ({
    authTokens: null,
    isAuthenticated: false,
    user: null,
    loginError: false,
    loginSuperuserError: false,

    setTokens: (tokens: AuthTokens) => {
        if (tokens){
            set({ authTokens: tokens, isAuthenticated: true, user: jwtDecode(tokens.access) as User });
        } else {
            set({ authTokens: null, isAuthenticated: false, user: null})
        }
    },

    setUser: (user) => set({ user }),

    loginUser: async (formData: FormData) => {
    // 1. Сбрасываем ошибки перед новым запросом
    set({ loginError: false, loginSuperuserError: false });

    try {
        const response = await axiosInstance.post('/admin-user/login/', formData);
        
        // Сюда мы попадаем ТОЛЬКО если статус 2xx (200, 201...)
        const { access, refresh } = response.data;
        const tokens: AuthTokens = { access, refresh };

        Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' });
        Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
        
        get().setTokens(tokens);
        window.location.href = '/dashboard';

    } catch (err) {
        // 2. Сюда попадают ВСЕ ошибки (401, 500, Network Error)
        console.error('Login failed:', err);

        // Используем нашу "пуленепробиваемую" функцию
        const apiError = toApiError(err);

        // 3. Теперь безопасно проверяем статус
        if (apiError.status === 401) {
            // Неверный логин/пароль
            set({ loginError: true });
        } else {
            // Любая другая ошибка (500, Сеть, 403 и т.д.)
            set({ loginSuperuserError: true });
            
            // Опционально: можно сохранить сообщение об ошибке, чтобы показать пользователю
            // set({ errorMessage: apiError.message });
        }
    }
},

    setLoginError: () => set({loginError: false}),
    
    setSuperuserError: () => set({loginSuperuserError: false}),

    logoutUser: () => {
        Cookies.remove('access', { secure: true, sameSite: 'Strict' });
        Cookies.remove('refresh', { secure: true, sameSite: 'Strict' });
        set({authTokens: null, user: null, isAuthenticated: false});
        window.location.href = '/';
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