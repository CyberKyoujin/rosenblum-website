import { BiSolidError } from "react-icons/bi";



const ErrorView  = () => {
    return (
        <div className="error-view-container">
            
            <BiSolidError size={100} className="app-icon"/>
            <h3>Es ist ein Fehler aufgetreten. Versuchen Sie es bitte später.</h3>

        </div>
    )
}

export default ErrorView