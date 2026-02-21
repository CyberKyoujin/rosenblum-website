import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import FAQAccordion from "../components/FAQAccordion";
import ContactSection from "../components/ContactSection";
import { IoHelpCircleOutline } from "react-icons/io5";


const Faq = () => {

    const { t } = useTranslation();

    return (
        <>
        <div className="main-app-container">

            <div className="main-faq-container">

                <div className="faq-header">
                    <div className="faq-header__badge">
                        <IoHelpCircleOutline />
                        {t('faqBadge')}
                    </div>
                    <h1 className="faq-header__title">FAQ</h1>
                    <p className="faq-header__subtitle">{t('faqSubtitle')}</p>
                </div>

                <FAQAccordion/>

                <Divider style={{marginBottom: '3rem', marginTop: '4rem'}}/>

                <ContactSection order={false} text="faqText"/>

            </div>
        </div>
        <Footer/>
        </>
    )
}


export default Faq
