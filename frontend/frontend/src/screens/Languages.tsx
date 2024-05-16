import React from "react";
import ua from "../assets/ua.svg"
import ru from "../assets/ru.svg"
import de from "../assets/de.svg"
import Divider from '@mui/material/Divider';
import languages_first from "../assets/languages_first.jpg"
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import languages_second from "../assets/languages_second.jpg"
import contact from "../assets/contact.jpg"
import { useNavigate } from "react-router-dom";
import { GrContactInfo } from "react-icons/gr";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


const Languages = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
        <div style={{margin: '1rem 2rem'}}>

            <div role="presentation" className="profile-navigation">
                <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography color="text.primary">Sprachen</Typography>
                </Breadcrumbs>
            </div>

            <div className="languages-main-container">

                <div className="languages-section">

                    <div className="languages-section-title">
                        <h1>Unser</h1>
                        <h1 className="header-span">Sprachportfolio</h1>
                    </div>

                    <div className="languages-items">

                        <div className="languages-item">
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={de} alt="Deutsch" />
                                    </div>
                                    <div className="flip-card-back">
                                        <p>Mehr als</p>
                                        <p style={{fontWeight: 'bold', color: 'RGB(44 100 213)'}}>2000</p>
                                        <p>Übersetzungen</p>
                                    </div>
                                </div>
                            </div>
                            <p>Deutsch</p>
                        </div>

                        <div className="languages-item">
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={ua} alt="Ukrainisch" />
                                    </div>
                                    <div className="flip-card-back">
                                        <p>Mehr als</p>
                                        <p style={{fontWeight: 'bold', color: 'RGB(44 100 213)'}}>5000</p>
                                        <p>Übersetzungen</p>
                                    </div>
                                </div>
                            </div>
                            <p>Ukrainisch</p>
                        </div>

                        <div className="languages-item">
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={ru} alt="Russisch" />
                                    </div>
                                    <div className="flip-card-back">
                                        <p>Mehr als</p>
                                        <p style={{fontWeight: 'bold', color: 'RGB(44 100 213)'}}>1000</p>
                                        <p>Übersetzungen</p>
                                    </div>
                                </div>
                            </div>
                            <p>Russisch</p>
                        </div>

                    </div>

                </div>

                <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                <div className="translations-section">

                    <div className="translations-section-text">
                    <div className="translations-section-title">
                            <h1>Warum die Sprachvielfalt</h1>
                            <h1 className="header-span">wichtig ist?</h1>
                        </div>
                        <p>{t('vielfalt')}</p>
                    </div>

                    <img src={languages_first} alt="" className="second-image"/>

                </div>

                <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                <div className="translations-section" style={{gap: '2rem'}}>

                    <img src={languages_second} alt="" className="third-image"/>

                    <div className="translations-section-text">
                            <div className="translations-section-title">
                                <h1>Unsere</h1>
                                <h1 className="header-span">Verpflichtung</h1>
                            </div>
                            <ol className="services-list" style={{lineHeight: '25px', fontSize: '18px', marginLeft: '1rem'}}>
                                <li><span>{t('qualitatTitle')}</span>{t('qualitat')}</li>
                                <li><span>{t('verständnisTitle')}</span>{t('verständnis')}</li>
                                <li><span>{t('unterstützungTitle')}</span>{t('unterstützung')}</li>
                                <li><span>{t('lösungenTitle')}</span>{t('lösungen')}</li>
                            </ol>
                    </div>

                </div>

                <Divider style={{marginTop: '4rem', marginBottom: '1rem'}}/>

                <div className="translations-section">

                    <div className="translations-section-text">
                        <div className="translations-section-title">
                            <h1 className="header-span">Kontaktieren</h1>
                            <h1>Sie uns</h1>
                        </div>
                        <p>{t('translationsContact')}</p>
                        <button className="contact-us-btn hover-btn" onClick={() => navigate('/contact-us')} style={{padding: '0.75rem', marginTop: '0rem'}}><GrContactInfo style={{fontSize: '35px'}}/>KONTAKTIEREN SIE UNS</button>

                    </div>

                    <img src={contact} alt="" className="contact-image"/>
                   
            </div>

            </div>
            
        </div>
        <Footer/>
        </>

    );
}



export default Languages