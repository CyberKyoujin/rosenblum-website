import { Navigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";
import { ReactNode } from "react";
import AppLoader from "./AppLoader";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);
    const isAuthLoading = useAuthStore(s => s.isAuthLoading);

    if (isAuthLoading) return <AppLoader />;
    return isAuthenticated ? children : <Navigate to="/"/>;
}

export default ProtectedRoute;
