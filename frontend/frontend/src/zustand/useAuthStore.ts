import axios from "axios";
import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axiosInstance from "./axiosInstance";
import type { AuthState, AuthTokens, ApiError } from "../types/auth";
import type { User, UserData } from "../types/user";


const useAuthStore = create<AuthState>((set,get) =>({

    authTokens: null,
    user: null,
    loading: false,
    userRegisterError: null,
    userLoginError: null,
    userDataError: null,
    userUpdateError: null,
    userDataLoading: false,
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

        const hasTokens = !!accessToken && !!refreshToken;

        if (!hasTokens) {
        set({ isAuthLoading: false, isAuthenticated: false });
        return;
        }

        const tokens: AuthTokens = { access: accessToken, refresh: refreshToken };
        get().setTokens(tokens);

        try{

            const response = await axiosInstance.get('user/user-data/');
            set({ 
                userData: response.data,
                isAuthenticated: true,
            })

        } catch (err: unknown) {

            set({ user: null, userData: null, isAuthenticated: false, authTokens: null });
            get().logoutUser();

        } finally {
            set({isAuthLoading: false})
        }

    },

    registerUser: async (email, firstName, lastName, password) => {
        try{

            set({loading: true, userRegisterError: null});
            const response = await axiosInstance.post('/user/register/', {email: email, first_name: firstName, last_name: lastName, password: password});
            
        } catch(err: unknown){

            const error = err as ApiError;
            set({userRegisterError: error})
            throw error;

        } finally {
            set({loading: false});
        }
    },

    loginUser: async (email, password) => {
        try{

            set({loading: true, userLoginError: null});

            const response = await axiosInstance.post('/user/login/', {email, password});
            const { access, refresh } = response.data;

            Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
            Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });

            get().setTokens({access, refresh});

        } catch (err: unknown) {

            const error = err as ApiError;
            set({ userLoginError: error });
            throw error;

        } finally {
            set({loading: false});
        }
    },

    googleLogin: async (accessToken) => {
        try{
            set({ loading: true, userLoginError: null });
            const response = await axiosInstance.post('/user/login/google/', { access_token: accessToken });

            const { access, refresh } = response.data;
            const userData = jwtDecode(access) as User;

            Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
            Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });

            get().setUser(userData);
            get().setTokens({access, refresh});

            // TODO: Remove
            if (response.status === 200){
                window.location.href = '/profile';
            }

        } catch (err: unknown) {

            const error = err as ApiError;
            set({userLoginError: error});
            throw error;

        } finally {
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
            throw err;
        }
    },

    logoutUser: () => {
        Cookies.remove('access', { secure: true, sameSite: 'Strict' });
        Cookies.remove('refresh', { secure: true, sameSite: 'Strict' });
        set({authTokens: null, user: null, isAuthenticated: false, userLoginError: null, userRegisterError: null, userDataError: null});
    },

    fetchUserData: async() => {
            try{

                set({userDataLoading: true});
                const response = await axiosInstance.get('/user/user-data/')
                set({userData: response.data})     
                
            } catch(err: unknown) {
                const error = err as ApiError;
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
            try{
                set({loading: true, userUpdateError: null});
                const response = await axiosInstance.put('/user/update/', formData)

                // TODO: Remove

                if (response.status === 200){
                    window.location.href = '/profile';
                }
            } catch (err: unknown){
                const error = err as ApiError;
                set({userUpdateError: error})
                throw error;
            } finally {
                set({loading: false});
            }
    }

}))


export default useAuthStore