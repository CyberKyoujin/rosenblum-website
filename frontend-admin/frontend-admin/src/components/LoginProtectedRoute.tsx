import useAuthStore from "../zustand/useAuthStore";
import { Navigate } from "react-router-dom";


const LoginProtectedRoute = ({ children }: any) => {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated ? <Navigate to="/dashboard"/> : children
}


export default LoginProtectedRoute;