import verificationSuccess from "../assets/verification_success.json"
import Lottie from "lottie-react"
import { Link, useSearchParams } from "react-router-dom";
import { IoReceiptOutline, IoHomeOutline } from "react-icons/io5";
import useAuthStore from "../zustand/useAuthStore";
import { t } from 'i18next';

const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();
    const paymentIntent = searchParams.get("payment_intent");
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    return (
        <div className="pay-success">
            <div className="pay-success__card">

                <Lottie
                    animationData={verificationSuccess}
                    loop={false}
                    className="pay-success__animation"
                />

                <h1 className="pay-success__title">{t('paymentSuccessful')}</h1>
                <p className="pay-success__subtitle">
                    {t('paymentProcessedThankYou')}
                </p>

                {paymentIntent && (
                    <div className="pay-success__ref">
                        <IoReceiptOutline />
                        <span>{t('paymentReference')} {paymentIntent.slice(-8).toUpperCase()}</span>
                    </div>
                )}

                <div className="pay-success__actions">
                    {isAuthenticated && (
                        <Link to="/profile" className="pay-success__btn pay-success__btn--primary">
                            {t('myOrders')}
                        </Link>
                    )}
                    <Link to="/" className="pay-success__btn pay-success__btn--ghost">
                        <IoHomeOutline />
                        {t('backToHome')}
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default PaymentSuccess;
