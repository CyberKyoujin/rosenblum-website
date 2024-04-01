import axios from "axios";
import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";



interface User {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_img_url: string | null;
} 

interface AuthTokens {
    access: string;
    refresh: string;
}

interface AuthState {
    authTokens: AuthTokens | null;
    user: User | null;
    isAuthenticated: boolean;
    emailAlreadyExists: boolean;
    setTokens: (authTokens: AuthTokens | null) => void; 
    setUser: (user: User | null) => void;
    registerUser: (email: string, first_name: string, last_name: string, password: string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    googleLogin: (accessToken: string) => Promise<void>;
    updateToken: () => void;
    logoutUser: () => void;
}



const useAuthStore = create<AuthState>((set,get) =>({
    authTokens: localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') || '{}') as AuthTokens : null,
    user: localStorage.getItem('authTokens') ? jwtDecode<User>(JSON.parse(localStorage.getItem('authTokens') || '').access) : null,
    isAuthenticated: !!localStorage.getItem('authTokens'),
    emailAlreadyExists: false,

    setTokens: (authTokens: AuthTokens | null) => {
        if (authTokens){
            localStorage.setItem('authTokens', JSON.stringify(authTokens));
            set({
                authTokens,
                user: jwtDecode<User>(authTokens.access),
                isAuthenticated: true
            });
        } else {
            localStorage.removeItem('authTokens');
            set({ authTokens: null, user: null, isAuthenticated: false });
        }
    },

    setUser: (user) => set({ user }),

    registerUser: async (email, firstName, lastName, password) => {
        try{
            const response = await axios.post('http://127.0.0.1:8000/user/register/', {email: email, first_name: firstName, last_name: lastName, password: password});
            console.log("Registered successfully:", response.data);
            if (response.status === 200){
                window.location.href = '/profile';
            }
        } catch(error: any){
            console.error("Error while registering: " + error.response.status);
            throw error;
        }
    },

    loginUser: async (email, password) => {
        try{
            const response = await axios.post('http://127.0.0.1:8000/user/login/', {email, password});
            console.log("Logged in successfully:", response.data);
            const userData = jwtDecode(response.data.access) as User;
            get().setTokens(response.data);
            get().setUser(userData);
            if (response.status === 200){
                window.location.href = '/profile';
            }
        } catch (error: any) {
            console.error("Error while logging in: " + error.message);
            throw error;
        }
    },

    googleLogin: async (accessToken) => {
        try{
            const response = await axios.post('http://127.0.0.1:8000/user/login/google/', { access_token: accessToken });
            console.log("Successfully logged in with Google", response.data);
            get().setTokens(response.data);
            console.log(response.status)
            if (response.status === 200){
                window.location.href = '/profile';
            }
        } catch (error: any) {
            console.error("Error while logging in with Google: " + error.message);
            throw error;
        }
    },

    updateToken: async () => {
        if(get().authTokens){
            try{
                const response = await axios.post('http://127.0.0.1:8000/user/token-refresh/', {refresh: get().authTokens?.refresh});
                console.log('Token Refresh Success:', response.data);
                get().setTokens(response.data);
            } catch (error: any){
                console.error("Error while updating token: " + error.message);
                throw error;
            }
        }
    },

    logoutUser: () => {
        set({authTokens: null, user: null, isAuthenticated: false});
        localStorage.removeItem('authTokens');
    }



}))
    


export default useAuthStore