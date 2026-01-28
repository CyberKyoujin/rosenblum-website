import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import planetIcon from "../assets/planet_icon.webp"
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";
import NavigationSection from "../components/NavigationSection";
import ServiceProcessSteps from "../components/ServiceProcessSteps";
import processIcon from "../assets/process_image.webp"
import { LuBadgeInfo } from "react-icons/lu";

const translationSteps = [
    {stepTitle: "kontaktaufnahmeTitle", step: "kontaktaufnahme"},
    {stepTitle: "planungTitle", step: "planung"},
    {stepTitle: "übersetzungTitle", step: "übersetzung"},
    {stepTitle: "durchführungTitle", step: "durchführung"},
]


const VerbalTranslations = () => {

    const { t } = useTranslation();

    return (
        <>

            <div className="main-app-container">

                <NavigationSection first_link="Dolmetschen"/>

                <div className="main-translations-container">

                    <Section badgeText="verbalWarning" BadgeIcon={LuBadgeInfo} image={planetIcon} imageClass="first-image" titleTextFirst="" titleTextSecond={t('verbalTranslations')} text="dolmetschen" order={true}/>

                    <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                    <ServiceProcessSteps order= {false} img={processIcon} steps={translationSteps} link="contact-us" linkText="contactUsFull" addProcessIcon title="soWorks" titleSpan="it"/>

                    <Divider style={{marginTop: '4rem', marginBottom: '1rem'}}/>

                    <ContactSection order text="verbalTranslationsContact"/>
                    
                </div>

            </div>

            <Footer/>

        </>
    )
}


export default VerbalTranslations