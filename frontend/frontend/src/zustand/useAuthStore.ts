import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosInstance";
import type { AuthState, AuthTokens } from "../types/auth";
import type { User } from "../types/user";
import { toApiError } from "../axios/toApiError";


const useAuthStore = create<AuthState>((set,get) =>({

    authTokens: null,
    user: null,
    loading: false,
    userDataLoading: false,
    userDataError: null,
    isAuthenticated: false,
    emailAlreadyExists: false,
    userData: null,
    userMessages: null,
    isAuthLoading: true,

    setTokens: (tokens: AuthTokens | null) => {
        if (tokens) {
            set({
                authTokens: tokens,
                user: jwtDecode(tokens.access) as User,
                isAuthenticated: true
            });
        } else {
            set({
                authTokens: null,
                user: null,
                isAuthenticated: false
            });
        }
    },

    setUser: (user) => set({user: user}),

    initAuth: async () => {
        const accessToken = Cookies.get("access")
        const refreshToken = Cookies.get("refresh");


        if (!accessToken || !refreshToken) {
        set({ isAuthLoading: false, isAuthenticated: false });
        return;
        }

        const tokens: AuthTokens = { access: accessToken, refresh: refreshToken };
        get().setTokens(tokens);

        try{

            const response = await axiosInstance.get('user/users/me/');
            set({ 
                userData: response.data,
                isAuthenticated: true,
                userDataError: null
            })

        } catch (err: unknown) {

            const error = toApiError(err);

            if (error.status === 401) {
                 set({ user: null, userData: null, isAuthenticated: false, authTokens: null });
                 get().logoutUser();
            } else {
                 set({ userDataError: error, isAuthLoading: false });
                 
            }

        } finally {
            set({isAuthLoading: false})
        }

    },

    registerUser: async (email, firstName, lastName, password) => {
        set({loading: true});
        try{

            await axiosInstance.post('user/users/register/', {email: email, first_name: firstName, last_name: lastName, password: password});
            get().fetchUserData();
            
        } catch(err: unknown){

            throw toApiError(err);

        } finally {
            set({loading: false});
        }
    },

    loginUser: async (email, password) => {
        set({loading: true, userDataError: null});
        try{

            const response = await axiosInstance.post('/user/login/', {email, password});
            const { access, refresh } = response.data;

            Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
            Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });

            get().setTokens({access, refresh});

            await get().fetchUserData();

        } catch (err: unknown) {

            throw toApiError(err);

        } finally {
            set({loading: false});
        }
    },

    googleLogin: async (accessToken) => {
        set({ loading: true });
        try{
            
            const response = await axiosInstance.post('/user/login/google/', { access_token: accessToken });

            const { access, refresh } = response.data;
            const userData = jwtDecode(access) as User;

            Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
            Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });

            get().setUser(userData);
            get().setTokens({access, refresh});
            await get().fetchUserData();

        } catch (err: unknown) {

            throw toApiError(err);

        } finally {
            set({loading: false});
        }
    },

    sendResetLink: async (email: string) => {

        set({loading: true});

        try {
            await axiosInstance.post('/user/users/reset-password-link/', {email});
        } catch (err: unknown) {

            throw toApiError(err);

        } finally{
            set({loading: false});
        }

    },

    resetPassword: async (uid: string, token: string, password: string) => {
        set({loading: true});

        try {
            await axiosInstance.post('/user/users/reset-password-confirm/', {uid, token, password});
        } catch (err: unknown) {

            throw toApiError(err);

        } finally{
            set({loading: false});
        }
    },

    updateToken: async () => {
        try{
            const refreshToken = Cookies.get('refresh');

            if (!refreshToken) {
                get().logoutUser();
                throw new Error('Refresh token not found');
            }

            const response = await axiosInstance.post('/user/token-refresh/', { refresh: refreshToken });
            const { access, refresh } = response.data;

            Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
            Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });

            get().setTokens({ access, refresh });

        } catch (err: unknown) {
            get().logoutUser();
            throw toApiError(err);
        }
    },

    logoutUser: () => {
        Cookies.remove('access', { secure: true, sameSite: 'Strict' });
        Cookies.remove('refresh', { secure: true, sameSite: 'Strict' });
        set({authTokens: null, user: null, isAuthenticated: false, userData: null});
    },

    fetchUserData: async() => {
            set({userDataLoading: true, userDataError: null});
            try{

                const response = await axiosInstance.get('/user/users/me/')
                set({userData: response.data})     
                
            } catch(err: unknown) {

                const error = toApiError(err);

                set({ userDataError: error });

                if (error.status === 401) {
                    get().logoutUser();
                }
                throw error;

                } finally {
                    set({userDataLoading: false});
                }
        
    },

    updateUserProfile: async (formData: FormData) => {  
            set({loading: true});
            try{
                
                await axiosInstance.patch('/user/users/', formData)
                
                await get().fetchUserData();

            } catch (err: unknown){

                throw toApiError(err);
                
            } finally {
                set({loading: false});
            }
    }

}))


export default useAuthStore