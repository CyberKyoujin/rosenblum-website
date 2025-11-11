import verificationSuccess from "../assets/verification_success.json"
import Lottie from "lottie-react"
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const EmailVerificationSuccess = () => {

    const navigate = useNavigate();
    const location = useLocation();
    
    const state = location.state as {email?: string} | null;
    const email = state?.email;


    return (
        <div className="verification_success__page">
        <div className="verification_success__container">
            
                <Lottie animationData={verificationSuccess} loop={false} className="verification_success__icon"/>
                <div className="verification_success__details">
                    <h1>Email erfolgreich verifiziert!</h1>
                    <p>Willkomen bei Übersetzungsbüro Rosenblum.</p>
                    <Link to="/login" className="verification_success__btn">Anmelden</Link>
                </div> 

        </div>

        <Footer/>

        </div>
    )
}

export default EmailVerificationSuccess;