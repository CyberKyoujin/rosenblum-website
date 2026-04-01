import { create } from "zustand";
import axiosInstance from "./axiosInstance";
import { toApiError } from "../utils/toApiError";
import { ApiErrorResponse } from "../types/error";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile_img_url: string | null;
    is_staff: boolean;
}

interface AuthState {
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    user: User | null;
    loginError: ApiErrorResponse | null;
    loading: boolean;
    initAuth: () => Promise<void>;
    loginUser: (formData: FormData) => Promise<void>;
    logoutUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    isAuthLoading: true,
    user: null,
    loading: false,
    loginError: null,

    initAuth: async () => {
        try {
            const response = await axiosInstance.get('/user/users/me/');
            const user = response.data;
            if (!user.is_staff) {
                set({ isAuthenticated: false, user: null });
                return;
            }
            set({ user, isAuthenticated: true });
        } catch {
            set({ isAuthenticated: false, user: null });
        } finally {
            set({ isAuthLoading: false });
        }
    },

    loginUser: async (formData: FormData) => {
        set({ loginError: null, loading: true });
        try {
            await axiosInstance.post('/admin-user/login/', formData);
            await get().initAuth();
            window.location.href = '/dashboard';
        } catch (err: unknown) {
            const apiError = toApiError(err);
            if (apiError.status === 401) {
                apiError.message = "E-Mail oder Passwort ist falsch";
            } else if (apiError.status === 403) {
                apiError.message = "Nur Admin-Nutzer können sich einloggen";
            }
            set({ loginError: apiError });
        } finally {
            set({ loading: false });
        }
    },

    logoutUser: async () => {
        try {
            await axiosInstance.post('/user/logout/');
        } catch {
            // ignore
        }
        set({ user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
