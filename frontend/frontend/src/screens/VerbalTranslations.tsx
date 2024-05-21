import React from "react";
import verbal_first from '../assets/verbal_first.jpg'
import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import translations_second from "../assets/translations_second.jpg"
import Footer from "../components/Footer";
import translations_third from "../assets/translations_third.jpg"
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import gears from "../assets/gears.gif"
import { GrContactInfo } from "react-icons/gr";
import phone from "../assets/phone.gif"
import contact from "../assets/contact.jpg"
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import planetIcon from "../assets/smartphone_icon.jpg"
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";


const VerbalTranslations = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <>
        <div style={{padding: '1rem 3rem'}}>


            <div role="presentation" className="profile-navigation">
                <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography color="text.primary">Dolmetschen</Typography>
                </Breadcrumbs>
            </div>


            <div className="main-translations-container">

                <Section image={planetIcon} imageClass="first-image verbal-first-image" titleTextFirst="" titleTextSecond="Dolmetschen." text="dolmetschen" order={true}/>

                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <Section image={translations_second} imageClass="second-image" titleTextFirst="Was ist" titleTextSecond="Dolmetschen?" text="whatAreVerbalTranslations" order={false}/>

                <Divider style={{marginTop: '2rem', marginBottom: '3rem'}}/>

                <div className="translations-services">

                    <div className="translations-services-title">
                        <h2 className="header-span">Unsere Dolmetschdienste</h2>
                        <h2>umfassen:</h2>
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

                    <img src={translations_third} alt=""  className="third-image"/>

                    <div className="translations-section-list">
                        <div className="translations-process-title">
                            <img src={gears} alt="" style={{width: '70px'}}/>
                           
                            <h1 className="header-span">So funktionert</h1>
                            <h1>es.</h1>
                           
                        </div>
                        <ol className="services-list" style={{lineHeight: '25px', fontSize: '18px', marginLeft: '2rem'}}>
                            <li><span>{t('kontaktaufnahmeTitle')}</span>{t('kontaktaufnahme')}</li>
                            <button className="hover-btn services-send-btn" onClick={() => navigate('/contact-us')}>KONTAKT AUFNEHMEN<FaArrowRightLong/></button>
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