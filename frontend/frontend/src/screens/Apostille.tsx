import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import apostille from "../assets/apostille.webp"
import apostille_ukr from "../assets/apostille_ukr.webp"
import { IoWarningOutline } from "react-icons/io5";
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";
import apoIcon from "../assets/apo_icon.webp"
import timeIcon from "../assets/time_icon.webp"
import questionIcon from "../assets/question_icon.webp"
import NavigationSection from "../components/NavigationSection";
import ServiceProcessSteps from "../components/ServiceProcessSteps";
import { LuBadgeInfo } from "react-icons/lu";


const apostilleSteps = [
    {stepTitle: "rechtsdokumenteTitle", step: "rechtsdokumente"},
    {stepTitle: "standesamtsdokumenteTitle", step: "standesamtsdokumente"},
    {stepTitle: "bildungsdokumenteTitle", step: "bildungsdokumente"}
]

const Apostille = () => {

    const { t } = useTranslation();

    return (
        <>

        <div className="main-app-container">


            <NavigationSection first_link="Apostille"/>

            <div className="main-translations-container">

            <Section image={apoIcon} imageClass="first-image" titleTextFirst="" titleTextSecond={t('appostile')} text="apostille" order={true}/>

            <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

            <Section image={questionIcon} imageClass="second-image" titleTextFirst={t('whatIs')} titleTextSecond={t('oneApostille') + " ?"} text="wasIstApostille" order={false}/>

            <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

            <ServiceProcessSteps badgeText="answerApo" BadgeIcon={LuBadgeInfo} order linkText="" steps={apostilleSteps} addProcessIcon={false} img={timeIcon} title="whenYouNeed" titleSpan="oneApostille"/>

            <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

            <div className="apostille-section">
                <div className="apostille-section-title">
                    <h1>{t('howLooksLike')}</h1>
                    <h1 className="header-span">{t('oneApostilleLooks') + " ?"}</h1>
                </div>

                <div className="apostille-images">
                    <img src={apostille} alt="" className="apostille-first-img" loading="lazy"/>
                    <img src={apostille_ukr} alt="" className="apostille-second-img" loading="lazy"/>
                </div>

                <div className="apostille-notification">
                        <IoWarningOutline className="warning-icon"/>
                        <p>{t('weCanApostille')}</p>
                </div>
            </div>

            <Divider style={{marginTop: '4rem', marginBottom: '1rem'}}/>

            <ContactSection order={false} text="apostilleContact"/>

            </div>
        </div>
        <Footer/>
        </>
    )
}


export default Apostille