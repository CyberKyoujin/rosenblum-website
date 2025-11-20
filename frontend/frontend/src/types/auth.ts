import type { User, UserData } from "./user"
import type { Message } from "./messages";

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface ApiError{
    status: number | null;
    message: string | null;
    errors?: any;
}

export interface AuthState {
    authTokens: AuthTokens | null;
    user: User | null;
    userRegisterError: ApiError | null;
    userLoginError: ApiError | null;
    loading: boolean;
    userData: UserData | null;
    userDataLoading: boolean;
    userDataError: ApiError | null;
    userMessages: Message[] | null;
    userUpdateError: ApiError | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
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