import axios from "axios";
import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axiosInstance from "./axiosInstance";
import type { AuthState, AuthTokens } from "../types/auth";
import type { User, UserData } from "../types/user";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const {t} = useTranslation();

const useAuthStore = create<AuthState>((set,get) =>({

    authTokens: null,
    user: null,
    loading: false,
    userRegisterError: null,
    userLoginError: null,
    userDataError: null,
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

        } catch (err) {

            set({user: null, userData: null, isAuthenticated: false});
            get().logoutUser();

        } finally {
            set({isAuthLoading: false})
        }

    },

    registerUser: async (email, firstName, lastName, password) => {
        try{
            set({loading: true});
            const response = await axiosInstance.post('/user/register/', {email: email, first_name: firstName, last_name: lastName, password: password});
            console.log("Registered successfully:", response.data);
            
        } catch(error: any){

            if (error.response.status === 306){
                set({ userRegisterError: t('emailAlreadyExists')});
                return;
            }

            const status = error.response?.status;
            const errors = error.response?.data?.errors;
            set({userRegisterError: `Error ${status}: ${errors}`})
        } finally {
            set({loading: false});
        }
    },

    loginUser: async (email, password) => {
        try{
            set({loading: true});
            const response = await axiosInstance.post('/user/login/', {email, password});
            const { access, refresh } = response.data;
            const tokens: AuthTokens = { access, refresh };
            Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
            Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
            get().setTokens(tokens);
            get().setUser(jwtDecode(access) as User);
        } catch (error: any) {
            const status = error.response?.status;
            const errors = error.response?.data?.errors;
            set({userLoginError: `Error ${status}: ${errors}`})
        } finally {
            set({loading: false});
        }
    },

    googleLogin: async (accessToken) => {
        try{
            const response = await axiosInstance.post('/user/login/google/', { access_token: accessToken });
            console.log("Successfully logged in with Google", response.data);
            const userData = jwtDecode(response.data.access) as User;
            Cookies.set('access', response.data.access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
            Cookies.set('refresh', response.data.refresh, { expires: 7, secure: true, sameSite: 'Strict' });
            get().setUser(userData);
            get().setTokens(response.data);
            console.log(response.status)
            if (response.status === 200){
                window.location.href = '/profile';
            }
        } catch (error: any) {
            const status = error.response?.status;
            const errors = error.response?.data?.errors;
            set({userLoginError: `Error ${status}: ${errors}`})
        }
    },

    updateToken: async () => {
        try{
            const refreshToken = Cookies.get('refresh');
            if (refreshToken) {
                const response = await axiosInstance.post('/user/token-refresh/', { refresh: refreshToken });
                const { access, refresh } = response.data;
                Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
                Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
                get().setTokens(response.data);
            } else {
                get().logoutUser();
                throw new Error('Refresh token not found');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    logoutUser: () => {
        Cookies.remove('access', { secure: true, sameSite: 'Strict' });
        Cookies.remove('refresh', { secure: true, sameSite: 'Strict' });
        set({authTokens: null, user: null, isAuthenticated: false});
    },

    fetchUserData: async() => {
            try{
                set({userDataLoading: true});
                const response = await axiosInstance.get('/user/user-data/')
                if (response.status === 200){
                    set({userData: response.data})
                } else {
                    get().logoutUser();
                }
            } catch(error: any) {
                const status = error.response?.status;
                const errors = error.response?.data?.errors;
                set({userDataError: `Error ${status}: ${errors}`})
            } finally {
                set({userDataLoading: false});
            }
        
    },

    updateUserProfile: async (formData: FormData) => {  
            try{
                set({loading: true});
                const response = await axiosInstance.put('/user/update/', formData)
                if (response.status === 200){
                    window.location.href = '/profile';
                }
            } catch (error){
                console.error('Error updating profile:', error);
            } finally {
                set({loading: false});
            }
    }


}))


export default useAuthStore