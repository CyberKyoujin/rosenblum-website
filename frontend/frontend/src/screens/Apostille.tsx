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

            <div className="translations-section" style={{gap: '4rem'}}>

                <img src={timeIcon} alt="" className="third-image" loading="lazy"/>

                <div className="translations-section-text">
                        <div className="translations-section-title">
                            <h1>{t('whenYouNeed')}</h1>
                            <h1 className="header-span">{t('oneApostille') + " ?"}</h1>
                        </div>
                        <ol className="services-list" style={{lineHeight: '25px', fontSize: '18px', marginLeft: '1rem'}}>
                            <li><span>{t('rechtsdokumenteTitle')}</span>{t('rechtsdokumente')}</li>
                            <li><span>{t('handelsdokumenteTitle')}</span>{t('handelsdokumente')}</li>
                            <li><span>{t('standesamtsdokumenteTitle')}</span>{t('standesamtsdokumente')}</li>
                            <li><span>{t('bildungsdokumenteTitle')}</span>{t('bildungsdokumente')}</li>
                        </ol>
                </div>

            </div>

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

            <ContactSection text="apostilleContact"/>

            </div>
        </div>
        <Footer/>
        </>
    )
}


export default Apostille