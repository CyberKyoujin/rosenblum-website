import React from "react";
import apostille_first from "../assets/apostille_first.jpg"
import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import translations_second from "../assets/translations_second.jpg"
import Footer from "../components/Footer";
import apostille_second from "../assets/apostille_second.jpg"
import apostille from "../assets/apostille.jpg"
import apostille_ukr from "../assets/apostille_ukr.jpg"
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";

const Apostille = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <>

        <div className="main-app-container">


            <div role="presentation" className="profile-navigation">
                <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography color="text.primary">Apostille</Typography>
                </Breadcrumbs>
            </div>

            <div className="main-translations-container">

            <Section image={apostille_first} imageClass="first-image verbal-first-image" titleTextFirst="" titleTextSecond={t('appostile')} text="apostille" order={true}/>

            <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

            <Section image={translations_second} imageClass="second-image" titleTextFirst={t('whatIs')} titleTextSecond={t('oneApostille') + " ?"} text="wasIstApostille" order={false}/>

            <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

            <div className="translations-section" style={{gap: '4rem'}}>

                <img src={apostille_second} alt="" className="third-image"/>

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
                    <img src={apostille} alt="" className="apostille-first-img"/>
                    <img src={apostille_ukr} alt="" className="apostille-second-img"/>
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