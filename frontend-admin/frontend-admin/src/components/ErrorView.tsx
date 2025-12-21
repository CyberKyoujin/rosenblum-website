import { BiSolidError } from "react-icons/bi";

interface ErrorViewProps {
    message? : string;
}

const ErrorView  = ({message}: ErrorViewProps) => {
    return (
        <div className="error-view-container">
            
            <BiSolidError size={100} className="app-icon"/>
            <h3>{message || "Es ist ein Fehler aufgetreten. Versuchen Sie es bitte später."}</h3>

        </div>
    )
}

export default ErrorView