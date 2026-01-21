import { useTranslation } from "react-i18next";
import { useIsAtTop } from '../hooks/useIsAtTop';
import NavigationSection from '../components/NavigationSection';
import ApiErrorAlert from '../components/ApiErrorAlert';
import Footer from "../components/Footer";
import OrderForm from '../components/OrderForm';
import { useOrder } from '../hooks/useOrder';

const Order = () => {
  const { t } = useTranslation();
  const isAtTop = useIsAtTop(10);
  const logic = useOrder();

  return (
    <>
      <div className="main-app-container">
        <ApiErrorAlert error={logic.error} belowNavbar={isAtTop} fixed />
        <NavigationSection first_link="Auftrag" />

        <div className="order-title">
          <div className="order-title-text">
            <h1>{t('documents')}</h1>
            <h1 className="header-span">{t('sendSmall')}</h1>
          </div>
        </div>

        <OrderForm logic={logic} />
      </div>
      <Footer />
    </>
  );
};

export default Order;