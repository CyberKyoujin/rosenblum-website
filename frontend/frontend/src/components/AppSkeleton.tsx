import React from "react";
import { CircularProgress } from "@mui/material";


const AppSkeleton = () => {
    return (
        <div className="app-skeleton-container">
            <CircularProgress className="app-skeleton-progress" size={80}/>
            <h2>Wird geladen...</h2>
        </div>
    )
}

export default AppSkeleton;