import React from "react";
import { IoIosWarning } from "react-icons/io";

interface ErrorViewProps {
  errorMessage: string | null;
};

const ErrorView = ({errorMessage}: ErrorViewProps) => {
    return (
        <div className="error-view-container">
            <IoIosWarning size={70} color="#4C79D4"/>
            <p>{errorMessage}</p>
        </div>
    )
}

export default ErrorView;