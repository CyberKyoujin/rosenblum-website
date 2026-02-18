import { useTranslation } from "react-i18next";
import { useIsAtTop } from '../hooks/useIsAtTop';
import ApiErrorAlert from '../components/ApiErrorAlert';
import Footer from "../components/Footer";
import { useOrder } from '../hooks/useOrder';
import OrderStepper from "../components/OrderStepper";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Order = () => {
  const { t } = useTranslation();
  const isAtTop = useIsAtTop(10);
  const logic = useOrder();

  return (
    <>
      <div className="main-app-container">

        <ApiErrorAlert error={logic.error} belowNavbar={isAtTop} fixed />

        <div className="order-title">
          <div className="order-title-text">
            <h1>{t('documents')}</h1>
            <h1 className="header-span">{t('sendSmall')}</h1>
          </div>
        </div>

        <div className="order-info-banner">
          <IoInformationCircleOutline className="order-info-banner__icon" />
          <p className="order-info-banner__text">
            Dieses Formular ist für die Bestellung von Übersetzungen oder Kostenvoranschlägen gedacht.
            Haben Sie allgemeine Fragen? Besuchen Sie unsere <Link to="/pricing" className="order-info-banner__link">Preise</Link> oder <Link to="/faq" className="order-info-banner__link">FAQ</Link> Seite.
            Für individuelle Anfragen nutzen Sie bitte unser <Link to="/contact" className="order-info-banner__link">Kontaktformular</Link>.
          </p>
        </div>

        <OrderStepper logic={logic}/>

      </div>
      <Footer />
    </>
  );
};

export default Order;