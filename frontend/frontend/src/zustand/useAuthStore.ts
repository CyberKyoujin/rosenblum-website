import { create } from 'zustand';
import axiosInstance from "../axios/axiosInstance";
import type { AuthState } from "../types/auth";
import { toApiError } from "../axios/toApiError";


const useAuthStore = create<AuthState>((set, get) => ({

    user: null,
    loading: false,
    userDataLoading: false,
    userDataError: null,
    isAuthenticated: false,
    emailAlreadyExists: false,
    userData: null,
    userMessages: null,
    isAuthLoading: true,

    setUser: (user) => set({ user: user }),

    initAuth: async () => {
        try {
            const response = await axiosInstance.get('user/users/me/');
            const userData = response.data;
            set({
                userData,
                isAuthenticated: true,
                userDataError: null,
            });
        } catch (err: unknown) {
            const error = toApiError(err);
            if (error.status === 401) {
                set({ user: null, userData: null, isAuthenticated: false });
            } else {
                set({ userDataError: error });
            }
        } finally {
            set({ isAuthLoading: false });
        }
    },

    registerUser: async (email, firstName, lastName, password) => {
        set({ loading: true });
        try {
            await axiosInstance.post('user/users/register/', { email, first_name: firstName, last_name: lastName, password });
            get().fetchUserData();
        } catch (err: unknown) {
            throw toApiError(err);
        } finally {
            set({ loading: false });
        }
    },

    loginUser: async (email, password) => {
        set({ loading: true, userDataError: null });
        try {
            await axiosInstance.post('/user/login/', { email, password });
            await get().fetchUserData();
        } catch (err: unknown) {
            throw toApiError(err);
        } finally {
            set({ loading: false });
        }
    },

    googleLogin: async (accessToken) => {
        set({ loading: true });
        try {
            await axiosInstance.post('/user/login/google/', { access_token: accessToken });
            await get().fetchUserData();
        } catch (err: unknown) {
            throw toApiError(err);
        } finally {
            set({ loading: false });
        }
    },

    sendResetLink: async (email: string) => {
        set({ loading: true });
        try {
            await axiosInstance.post('/user/users/reset-password-link/', { email });
        } catch (err: unknown) {
            throw toApiError(err);
        } finally {
            set({ loading: false });
        }
    },

    resetPassword: async (uid: string, token: string, password: string) => {
        set({ loading: true });
        try {
            await axiosInstance.post('/user/users/reset-password-confirm/', { uid, token, password });
        } catch (err: unknown) {
            throw toApiError(err);
        } finally {
            set({ loading: false });
        }
    },

    logoutUser: async () => {
        try {
            await axiosInstance.post('/user/logout/');
        } catch {
           
        }
        set({ user: null, isAuthenticated: false, userData: null });
    },

    deleteAccount: async () => {
        await axiosInstance.delete('user/users/delete_me/');
        get().logoutUser();
    },

    fetchUserData: async () => {
        set({ userDataLoading: true, userDataError: null });
        try {
            const response = await axiosInstance.get('/user/users/me/');
            const userData = response.data;
            set({
                userData,
                isAuthenticated: true,
            });
        } catch (err: unknown) {
            const error = toApiError(err);
            set({ userDataError: error });
            if (error.status === 401) {
                get().logoutUser();
            }
            throw error;
        } finally {
            set({ userDataLoading: false });
        }
    },

    updateUserProfile: async (formData: FormData) => {
        set({ loading: true });
        try {
            await axiosInstance.patch('/user/users/me/', formData);
            await get().fetchUserData();
        } catch (err: unknown) {
            throw toApiError(err);
        } finally {
            set({ loading: false });
        }
    },

}))


export default useAuthStore
