import type { User, UserData } from "./user"
import type { Message } from "./messages";


export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthState {
    authTokens: AuthTokens | null;
    user: User | null;
    userData: UserData | null;
    userMessages: Message[] | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    emailAlreadyExists: boolean;
    loading: boolean;
    setTokens: (authTokens: AuthTokens | null) => void;
    setUser: (user: User | null) => void; 
    initAuth: () => Promise<void>;
    registerUser: (email: string, first_name: string, last_name: string, password: string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    googleLogin: (accessToken: string) => Promise<void>;
    updateToken: () => void;
    logoutUser: () => void;
    fetchUserData: () => Promise<void>;
}