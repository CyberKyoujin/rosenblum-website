import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import NavigationSection from "../components/NavigationSection";
import FAQAccordion from "../components/FAQAccordion";
import ContactSection from "../components/ContactSection";


const Faq = () => {

    const { t } = useTranslation();

    return (
        <>
        <div className="main-app-container">

            <NavigationSection first_link="FAQ"/>

            <div className="main-faq-container">

                <div className="faq-title">
                    <h1 className="header-span">FAQ</h1>
                    <h1 className="faq-title-description">{"(" + t('questions') + ")"}</h1>
                </div>

                <FAQAccordion/>

                <Divider style={{marginBottom: '3rem', marginTop: '4rem'}}/>

                <ContactSection text="faqText"/>

            </div>
        </div>
        <Footer/>
        </>
    )
}


export default Faq