import { BiSolidError } from "react-icons/bi";

interface ErrorViewProps {
    message? : string;
    statsError?: boolean;
}

const ErrorView  = ({message, statsError}: ErrorViewProps) => {
    return (
        <div className="error-view-container" style={{marginTop: statsError ? "0rem" : "5rem", marginLeft: statsError ? "1.5rem" : "0rem"}}>
            
            <BiSolidError size={100} className="app-icon"/>
            <h3>{message || "Es ist ein Fehler aufgetreten. Versuchen Sie es bitte später."}</h3>

        </div>
    )
}

export default ErrorView