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
import { GrContactInfo } from "react-icons/gr";

const Apostille = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <>
        <div style={{padding: '1rem 2rem'}}>
            <div className="main-translations-container">

            <div className="translations-section">
                    <img src={apostille_first} alt="" className="first-image verbal-first-image"/>

                    <div className="translations-section-text">
                        <div className="translations-section-title">
                            <h1 className="header-span">Apostille.</h1>
                        </div>
                        <p>{t('dolmetschen')}</p>
                    </div>
            </div>

            <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

            <div className="translations-section">

                    <div className="translations-section-text">
                    <div className="translations-section-title">
                            <h1>Was ist</h1>
                            <h1 className="header-span">eine Apostille?</h1>
                        </div>
                        <p>{t('whatAreVerbalTranslations')}</p>
                    </div>

                    <img src={translations_second} alt="" className="second-image"/>

            </div>

            <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

            <div className="translations-section" style={{gap: '4rem'}}>

                <img src={apostille_second} alt="" className="third-image"/>

                <div className="translations-section-text">
                        <div className="translations-section-title">
                            <h1>Wann benötigen Sie</h1>
                            <h1 className="header-span">eine Apostille?</h1>
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
                    <h1>Wie sieht</h1>
                    <h1 className="header-span">eine Apostille aus?</h1>
                </div>

                <div className="apostille-images">
                    <img src={apostille} alt="" className="apostille-first-img"/>
                    <img src={apostille_ukr} alt="" className="apostille-second-img"/>
                </div>

                <div className="apostille-notification">
                        <IoWarningOutline className="warning-icon"/>
                        <p>Wir können eine Apostille nur auf die Unterlagen stellen, die in Osnabrück oder im Landkreis Osnabrück ausgestellt wurden !</p>
                </div>
            </div>

            <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

            <div className="translations-contact-container">

                    <div className="translations-contact-title">
                        <h1 className="header-span">Kontaktieren</h1>
                        <h1>Sie uns</h1>
                    </div>

                    <div className="translations-contact-text">
                        <p>{t('translationsContact')}</p>
                    </div>

                    <button className="contact-us-btn hover-btn" onClick={() => navigate('/contact-us')} style={{padding: '0.75rem', marginTop: '0rem'}}><GrContactInfo style={{fontSize: '35px'}}/>KONTAKTIEREN SIE UNS</button>

                </div>

            </div>
        </div>
        <Footer/>
        </>
    )
}


export default Apostille