import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import gears from "../assets/gears.gif"
import planetIcon from "../assets/planet_icon.webp"
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";
import questionIcon from "../assets/question_icon.webp"
import processIcon from "../assets/process_image.webp"
import NavigationSection from "../components/NavigationSection";


const VerbalTranslations = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <>
        <div className="main-app-container">

            <NavigationSection first_link="Dolmetschen"/>

            <div className="main-translations-container">

                <Section image={planetIcon} imageClass="first-image" titleTextFirst="" titleTextSecond={t('verbalTranslations')} text="dolmetschen" order={true}/>

                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <Section image={questionIcon} imageClass="second-image" titleTextFirst={t('whatIs')} titleTextSecond={t('verbalTranslations') + " ?"} text="whatAreVerbalTranslations" order={false}/>

                <Divider style={{marginTop: '2rem', marginBottom: '3rem'}}/>

                <div className="translations-services">

                    <div className="translations-services-title">
                        <h2 className="header-span">{t('ourSwornServices')}</h2>
                        <h2>{t('include')}</h2>
                    </div>

                    <div className="translations-services-content">
                        <ol className="services-list">
                            <li><span>{t('konsekutivdolmetschenTitle')}</span>{t('konsekutivdolmetschen')}</li>
                            <li><span>{t('simultandolmetschenTitle')}</span>{t('simultandolmetschen')}</li>
                        </ol>
                    </div>

                </div>

                <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                <div className="translations-section">

                    <img src={processIcon} alt=""  className="third-image" loading="lazy"/>

                    <div className="translations-section-list">
                        <div className="translations-process-title">
                            <img src={gears} alt="" style={{width: '70px'}} loading="lazy"/>
                           
                            <h1 className="header-span">{t('soWorks')}</h1>
                            <h1>{t('it')}</h1>
                           
                        </div>
                        <ol className="services-list" style={{lineHeight: '25px', fontSize: '18px', marginLeft: '2rem'}}>
                            <li><span>{t('kontaktaufnahmeTitle')}</span>{t('kontaktaufnahme')}</li>
                            <button className="hover-btn services-send-btn" onClick={() => navigate('/contact-us')}>{t('contactUsFull')}<FaArrowRightLong/></button>
                            <li><span>{t('planungTitle')}</span>{t('planung')}</li>
                            <li><span>{t('übersetzungTitle')}</span>{t('übersetzung')}</li>
                            <li><span>{t('einsatzTitle')}</span>{t('einsatz')}</li>
                            <li><span>{t('durchführungTitle')}</span>{t('durchführung')}</li>
                        </ol>
                    </div>

                </div>

                <Divider style={{marginTop: '4rem', marginBottom: '1rem'}}/>

                <ContactSection text="verbalTranslationsContact"/>

                
            </div>
        </div>
        <Footer/>
        </>
    )
}


export default VerbalTranslations