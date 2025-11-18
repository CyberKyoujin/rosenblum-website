import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";


const ProtectedRoute = ({ children }: {children: JSX.Element}) => {
    const { isAuthenticated, isAuthLoading } = useAuthStore();

    if (isAuthLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    
    return isAuthenticated ? children : <Navigate to="/login"/>
}

export default ProtectedRoute;