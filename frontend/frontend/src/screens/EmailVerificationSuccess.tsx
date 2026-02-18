import verificationSuccess from "../assets/verification_success.json"
import Lottie from "lottie-react"
import { Link, useLocation } from "react-router-dom";
import { IoLogInOutline, IoHomeOutline } from "react-icons/io5";

const EmailVerificationSuccess = () => {

    const location = useLocation();

    const state = location.state as {successMessage?: string} | null;
    const message = state?.successMessage || "Ihr Konto wurde erfolgreich verifiziert";

    return (
        <div className="pay-success">
            <div className="pay-success__card">

                <Lottie
                    animationData={verificationSuccess}
                    loop={false}
                    className="pay-success__animation"
                />

                <h1 className="pay-success__title">{message}!</h1>
                <p className="pay-success__subtitle">
                    Willkommen bei Übersetzungsbüro Rosenblum. Sie können sich jetzt anmelden.
                </p>

                <div className="pay-success__actions">
                    <Link to="/login" className="pay-success__btn pay-success__btn--primary" data-testid="success-btn">
                        <IoLogInOutline />
                        Anmelden
                    </Link>
                    <Link to="/" className="pay-success__btn pay-success__btn--ghost">
                        <IoHomeOutline />
                        Zur Startseite
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default EmailVerificationSuccess;