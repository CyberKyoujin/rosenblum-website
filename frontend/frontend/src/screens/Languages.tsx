import ua from "../assets/ua.svg"
import ru from "../assets/ru.svg"
import de from "../assets/de.svg"
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import qualityIcon from "../assets/quality_image.webp"
import NavigationSection from "../components/NavigationSection";
import LanguageCardsSection from "../components/LanguageCard";
import ServiceProcessSteps from "../components/ServiceProcessSteps";

const languageCards = [
    {image: de, translationsCount: 2000, language: "german"},
    {image: ua, translationsCount: 5000, language: "ukrainian"},
    {image: ru, translationsCount: 1000, language: "russian"},
]

const languageSteps = [
    {stepTitle: "qualitatTitle", step: "qualitat"},
    {stepTitle: "verständnisTitle", step: "verständnis"},
    {stepTitle: "unterstützungTitle", step: "unterstützung"},
    {stepTitle: "lösungenTitle", step: "lösungen"},
]

const Languages = () => {

    return (
        
        <>

            <div className="main-app-container">

                <NavigationSection first_link="Sprachen"/>

                <div className="languages-main-container">

                    <LanguageCardsSection cards={languageCards}/>

                    <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                    <ServiceProcessSteps linkText="" steps={languageSteps} addProcessIcon={false} img={qualityIcon} title="our" titleSpan="responsibility"/>

                    <Divider style={{marginTop: '4rem', marginBottom: '1rem'}}/>

                    <ContactSection text="translationsContact"/>

                </div>
            
            </div>

            <Footer/>  

        </>

    );
}



export default Languages