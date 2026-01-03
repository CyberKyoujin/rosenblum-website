import { Navigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";


const ProtectedRoute = ({ children }: {children: JSX.Element}) => {
    const { isAuthenticated } = useAuthStore();
    
    return isAuthenticated ? children : <Navigate to="/login" replace/>
}

export default ProtectedRoute;