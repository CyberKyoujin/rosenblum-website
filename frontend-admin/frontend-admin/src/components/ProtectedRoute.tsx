import { Navigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";
import { ReactNode } from "react";

interface ProtectedRouteProps{
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated ? children : <Navigate to="/"/>
}


export default ProtectedRoute;