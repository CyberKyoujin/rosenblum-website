import { Navigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";



const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated ? children : <Navigate to="/"/>
}


export default ProtectedRoute;