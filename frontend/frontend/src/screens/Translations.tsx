import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";
import planetIcon from "../assets/planet_icon.webp"
import questionIcon from "../assets/question_icon.webp"
import NavigationSection from "../components/NavigationSection";
import TranslationsServicesSection from "../components/TranslationsServicesSection";
import ServiceProcessSteps from "../components/ServiceProcessSteps";
import processIcon from "../assets/process_image.webp"

const translationsServicesItems = [
    {itemTitle: "rechtsDokumenteTitle", item: "rechtsDokumente"},
    {itemTitle: "einwanderungsDokumenteTitle", item: "einwanderungsDokumente"},
    {itemTitle: "akademischeZeugnisseTitle", item: "akademischeZeugnisse"},
    {itemTitle: "medizinischeUnterlagenTitle", item: "medizinischeUnterlagen"},
    {itemTitle: "geschäftsDokumenteTitle", item: "geschäftsDokumente"}
]

const translationSteps = [
    {stepTitle: "einreichungTitle", step: "einreichung"},
    {stepTitle: "überprüfungTitle", step: "überprüfung"},
    {stepTitle: "übersetzungTitle", step: "übersetzung"},
    {stepTitle: "qualitätTitle", step: "qualität"},
    {stepTitle: "zertifizierungTitle", step: "zertifizierung"},
    {stepTitle: "lieferungTitle", step: "lieferung"}
]

const Translations = () => {

    const { t } = useTranslation();

    return (
        <>

        <div className="main-app-container">

            <NavigationSection first_link="Beglaubigte Übersetzungen"/>

            <div className="main-translations-container">

                <Section image={planetIcon} imageClass="first-image" titleTextFirst={t('sworn')} titleTextSecond={t('translations')} text="translationsFirstSection" order={true}/>

                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <Section image={questionIcon} imageClass="second-image" titleTextFirst={t('whatAre')} titleTextSecond={t('swornTranslations') + '?'} text="whatAreTranslations" order={false}/>

                <Divider style={{marginTop: '2rem', marginBottom: '3rem'}}/>

                <TranslationsServicesSection titleSpan="ourSevices" title="forSwornTranslations" items={translationsServicesItems}/>

                <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                <ServiceProcessSteps img={processIcon} steps={translationSteps} link="order" linkText="sendDokuments" addProcessIcon title="soWorks" titleSpan="it"/>

                <Divider style={{marginTop: '4rem', marginBottom: '1rem'}}/>

                <ContactSection text="translationsContact"/>
         
            </div>
            
        </div>

        <Footer/>

        </>
        
    )
}


export default Translations