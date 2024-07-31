import { create } from "zustand";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";

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
            const response = await axiosInstance.post('/admin/login', formData);
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    },

    logoutUser: () => {},

    refreshToken: async () => {

    }
    

}))



export default useAuthStore;