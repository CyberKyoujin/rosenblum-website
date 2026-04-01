import type { User, UserData } from "./user"
import type { Message } from "./messages";
import { ApiErrorResponse } from "./error";

export interface ApiError{
    status: number | null;
    message: string | null;
    errors?: any;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    userData: UserData | null;
    userDataLoading: boolean;
    userDataError: ApiErrorResponse | null;
    userMessages: Message[] | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    setUser: (user: User | null) => void;
    sendResetLink: (email: string) => Promise<void>;
    resetPassword: (uid: string, token: string, password: string) => Promise<void>;
    initAuth: () => Promise<void>;
    registerUser: (email: string, first_name: string, last_name: string, password: string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    googleLogin: (accessToken: string) => Promise<void>;
    logoutUser: () => void;
    fetchUserData: () => Promise<void>;
    updateUserProfile: (formData: FormData) => Promise<void>;
    deleteAccount: () => Promise<void>;
}