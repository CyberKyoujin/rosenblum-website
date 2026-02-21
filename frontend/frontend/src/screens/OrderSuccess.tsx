import verificationSuccess from "../assets/verification_success.json"
import Lottie from "lottie-react"
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline, IoReceiptOutline } from "react-icons/io5";
import useAuthStore from "../zustand/useAuthStore";
import { t } from 'i18next';

interface OrderSuccessState {
    orderId?: number;
    type?: 'kostenvoranschlag' | 'rechnung';
}

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId, type } = (location.state as OrderSuccessState) || {};
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    const title = type === 'kostenvoranschlag'
        ? t('quoteRequested')
        : t('orderSuccessful');

    const subtitle = type === 'kostenvoranschlag'
        ? t('quoteCreationMessage')
        : t('orderReceivedMessage');

    return (
        <div className="pay-success">
            <div className="pay-success__card">

                <Lottie
                    animationData={verificationSuccess}
                    loop={false}
                    className="pay-success__animation"
                />

                <h1 className="pay-success__title">{title}</h1>
                <p className="pay-success__subtitle">{subtitle}</p>

                {orderId && (
                    <div className="pay-success__ref">
                        <IoReceiptOutline />
                        <span>{t('orderNumberPrefix')}{orderId}</span>
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

export default OrderSuccess;
