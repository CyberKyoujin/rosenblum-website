import axios from "axios";
import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axiosInstance from "./axiosInstance";

interface User {
    id: string | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_img_url: string;
} 

interface UserData {
    date_joined: string | null;
    phone_number: string | null;
    city: string | null;
    street: string | null;
    zip: string | null;
    image_url: string | null;
}

interface AuthTokens {
    access: string;
    refresh: string;
}

interface File {
    id: string | null;
    file_name: string | null;
    file_size: string | null;
}

interface Message {
    id: string;
    sender: string;
    receiver: string;
    message: string;
    viewed: boolean;
    timestamp: string;
    formatted_timestamp: string;
    files: File[];
}

interface Review {
    author_name: string | null;
    author_url: string | null;
    profile_photo_url: string | null;
    rating: number;
    relative_time_description: string | null;
    text: string | null;
}

interface AuthState {
    authTokens: AuthTokens | null;
    user: User | null;
    userData: UserData | null;
    userMessages: Message[] | null;
    reviews: Review[] | null;
    isAuthenticated: boolean;
    emailAlreadyExists: boolean;
    setTokens: (authTokens: AuthTokens | null) => void; 
    setUser: (user: User | null) => void;
    registerUser: (email: string, first_name: string, last_name: string, password: string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    googleLogin: (accessToken: string) => Promise<void>;
    updateToken: () => void;
    logoutUser: () => void;
    fetchUserData: () => Promise<void>;
    setUserData: (data: UserData | null) => void;
    fetchUserMessages: () => Promise<void>;
    setMessages: (messages: []) => void;
    setReviews: (reviews: Review[]) => void;
    updateUserProfile: (formData: FormData) => Promise<void>;
    toggleMessages: () => Promise<void>;
    sendMessage: (formData: FormData) => Promise<void>;
    sendRequest: (name: string, email: string, phone_number: string, message: string) => Promise<void>;
    fetchReviews: () => Promise<void>;
}



interface User {
    id: string | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_img_url: string;
} 

interface UserData {
    date_joined: string | null;
    phone_number: string | null;
    city: string | null;
    street: string | null;
    zip: string | null;
    image_url: string | null;
}

interface AuthTokens {
    access: string;
    refresh: string;
}

interface File {
    id: string | null;
    file_name: string | null;
    file_size: string | null;
}

interface Message {
    id: string;
    sender: string;
    receiver: string;
    message: string;
    viewed: boolean;
    timestamp: string;
    formatted_timestamp: string;
    files: File[];
}

interface Review {
    author_name: string | null;
    author_url: string | null;
    profile_photo_url: string | null;
    rating: number;
    relative_time_description: string | null;
    text: string | null;
}

interface AuthState {
    authTokens: AuthTokens | null;
    user: User | null;
    userData: UserData | null;
    userMessages: Message[] | null;
    reviews: Review[] | null;
    isAuthenticated: boolean;
    emailAlreadyExists: boolean;
    setTokens: (authTokens: AuthTokens | null) => void; 
    setUser: (user: User | null) => void;
    registerUser: (email: string, first_name: string, last_name: string, password: string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    googleLogin: (accessToken: string) => Promise<void>;
    updateToken: () => void;
    logoutUser: () => void;
    fetchUserData: () => Promise<void>;
    setUserData: (data: UserData | null) => void;
    fetchUserMessages: () => Promise<void>;
    setMessages: (messages: []) => void;
    setReviews: (reviews: Review[]) => void;
    updateUserProfile: (formData: FormData) => Promise<void>;
    toggleMessages: () => Promise<void>;
    sendMessage: (formData: FormData) => Promise<void>;
    sendRequest: (name: string, email: string, phone_number: string, message: string) => Promise<void>;
    fetchReviews: () => Promise<void>;
}



const useAuthStore = create<AuthState>((set,get) =>({
    authTokens: null,
    user: null,
    isAuthenticated: false,
    emailAlreadyExists: false,
    userData: null,
    userMessages: null,
    reviews: null,

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

    setUser: (user) => set({ user }),

    registerUser: async (email, firstName, lastName, password) => {
        try{
            const response = await axiosInstance.post('/user/register/', {email: email, first_name: firstName, last_name: lastName, password: password});
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
            const response = await axiosInstance.post('/user/login/', {email, password});
            console.log(response);
            const { access, refresh } = response.data;
            const tokens: AuthTokens = { access, refresh };
            Cookies.set('access', access, { expires: 7 / 24 / 60, secure: true, sameSite: 'Strict' }); 
            Cookies.set('refresh', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
            get().setTokens(tokens);
            get().setUser(jwtDecode(access) as User);
            window.location.href = '/profile';
        } catch (error: any) {
            console.error("Error while logging in: " + error.message);
            throw error;
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
                window.location.href = '/order';
                window.location.href = '/profile';
            }
        } catch (error: any) {
            console.error("Error while logging in with Google: " + error.message);
            throw error;
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
        set({authTokens: null, user: null, isAuthenticated: false});
        localStorage.removeItem('authTokens');
    },

    setUserData: (userData) => set({userData}),

    fetchUserData: async() => {
        const authTokens = get().authTokens || '';
        if(authTokens){
            try{
                const response = await axiosInstance.get('/user/user-data/', {
                    headers: {
                        Authorization: `Bearer ${get().authTokens?.access}`
                    }
                })
                if (response.status === 200){
                    get().setUserData(response.data)
                } else {
                    get().logoutUser();
                }
            } catch(error) {
                console.error(error);
            }
        }
    },

    updateUserProfile: async (formData: FormData) => {
        const authTokens = get().authTokens || '';
        if (authTokens){
            try{
                const response = await axiosInstance.put('/user/update/', formData, {
                    headers: {
                        'Authorization': `Bearer ${get().authTokens?.access}`
                    }
                })
                if (response.status === 200){
                    window.location.href = '/profile';
                }
            } catch (error){
                console.error('Error updating profile:', error);
            }
        }
    },

    setMessages: (userMessages) => set({userMessages}),

    fetchUserMessages: async () => {
        const authTokens = get().authTokens || '';
        if (authTokens){
            try{
                const response = await axiosInstance.get('/user/messages/', {
                    headers: {
                        'Authorization': `Bearer ${get().authTokens?.access}`
                    }
                })
                if (response.status === 200){
                    get().setMessages(response.data)
                }
            } catch(error: any) {
                console.log('Error while fetching messages...' + error.message)
            }
        }
    },

    toggleMessages: async () => {
        const authTokens = get().authTokens || '';
        if (authTokens){
            try{
                const response = await axiosInstance.get('/user/toggle-messages', {
                    headers: {
                        'Authorization': `Bearer ${get().authTokens?.access}`
                    }
                })
                if (response.status === 200){
                    console.log('Successfully toggled messages!')
                }
            } catch(error){
                console.error(error);
            }
        }
    },

    sendMessage: async(formData: FormData) => {
        const authTokens = get().authTokens || '';
        if (authTokens){
            try{
                const response = await axiosInstance.post('/user/send-message/', formData, {
                    headers: {
                        'Authorization': `Bearer ${get().authTokens?.access}`
                    }
                })
                if (response.status === 200){
                    console.log('Successfully sent a message!')
                }
            } catch (error){
                console.error(error);
            }
        }
    },

    sendRequest: async(name: string, email: string, phone_number: string, message: string) => {
            try{
                const response = await axiosInstance.post('/user/new-request/', {name, email, phone_number, message});

            } catch (error) {
                console.error(error);
            }
        
    },

    setReviews: (reviews) => set({reviews: reviews}), 

    fetchReviews: async() => {
        try{
            const response = await axiosInstance.get('/user/reviews');
            if (response.status === 200){
                get().setReviews(response.data);  
            }
        } catch(error){
            console.error(error);
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


export default useAuthStore