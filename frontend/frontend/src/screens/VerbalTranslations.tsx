import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import planetIcon from "../assets/planet_icon.webp"
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";
import questionIcon from "../assets/question_icon.webp"
import NavigationSection from "../components/NavigationSection";
import TranslationsServicesSection from "../components/TranslationsServicesSection";
import ServiceProcessSteps from "../components/ServiceProcessSteps";
import processIcon from "../assets/process_image.webp"


const translationsServicesItems = [
    {itemTitle: "konsekutivdolmetschenTitle", item: "konsekutivdolmetschen"},
    {itemTitle: "simultandolmetschenTitle", item: "simultandolmetschen"},
]

const translationSteps = [
    {stepTitle: "kontaktaufnahmeTitle", step: "kontaktaufnahme"},
    {stepTitle: "planungTitle", step: "planung"},
    {stepTitle: "übersetzungTitle", step: "übersetzung"},
    {stepTitle: "einsatzTitle", step: "einsatz"},
    {stepTitle: "durchführungTitle", step: "durchführung"},
]


const VerbalTranslations = () => {

    const { t } = useTranslation();

    return (
        <>

            <div className="main-app-container">

                <NavigationSection first_link="Dolmetschen"/>

                <div className="main-translations-container">

                    <Section image={planetIcon} imageClass="first-image" titleTextFirst="" titleTextSecond={t('verbalTranslations')} text="dolmetschen" order={true}/>

                    <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                    <Section image={questionIcon} imageClass="second-image" titleTextFirst={t('whatIs')} titleTextSecond={t('verbalTranslations') + " ?"} text="whatAreVerbalTranslations" order={false}/>

                    <Divider style={{marginTop: '2rem', marginBottom: '3rem'}}/>

                    <TranslationsServicesSection titleSpan="ourSwornServices" title="include" items={translationsServicesItems}/>

                    <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                    <ServiceProcessSteps img={processIcon} steps={translationSteps} link="contact-us" linkText="contactUsFull" addProcessIcon title="soWorks" titleSpan="it"/>

                    <Divider style={{marginTop: '4rem', marginBottom: '1rem'}}/>

                    <ContactSection text="verbalTranslationsContact"/>
                    
                </div>

            </div>

            <Footer/>

        </>
    )
}


export default VerbalTranslations