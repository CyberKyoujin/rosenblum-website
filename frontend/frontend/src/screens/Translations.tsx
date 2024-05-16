import React from "react";
import translations_first from '../assets/translations_first.png'
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

const Translations = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <>
        <div style={{padding: '1rem 2rem'}}>

            <div role="presentation" className="profile-navigation">
                <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography color="text.primary">Beglaubigte Übersetzungen</Typography>
                </Breadcrumbs>
            </div>


            <div className="main-translations-container">

                <div className="translations-section">
                    <img src={translations_first} alt="" className="first-image"/>

                    <div className="translations-section-text">
                        <div className="translations-section-title">
                            <h1>Beglaubigte</h1>
                            <h1 className="header-span">Übersetzungen.</h1>
                        </div>
                        <p>{t('translationsFirstSection')}</p>
                    </div>

                    

                </div>

                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <div className="translations-section">

                    <div className="translations-section-text">
                    <div className="translations-section-title">
                            <h1>Was sind</h1>
                            <h1 className="header-span">beglaubigte Übersetzungen?</h1>
                        </div>
                        <p>{t('whatAreTranslations')}</p>
                    </div>

                    <img src={translations_second} alt="" className="second-image"/>

                </div>

                <Divider style={{marginTop: '2rem', marginBottom: '3rem'}}/>

                <div className="translations-services">

                    <div className="translations-services-title">
                        <h2 className="header-span">Unsere Dienstleistungen</h2>
                        <h2>für beglaubigte Übersetzungen umfassen:</h2>
                    </div>

                    <div className="translations-services-content">
                        <ol className="services-list">
                            <li><span>{t('rechtsDokumenteTitle')}</span>{t('rechtsDokumente')}</li>
                            <li><span>{t('einwanderungsDokumenteTitle')}</span>{t('einwanderungsDokumente')}</li>
                            <li><span>{t('akademischeZeugnisseTitle')}</span>{t('akademischeZeugnisse')}</li>
                            <li><span>{t('medizinischeUnterlagenTitle')}</span>{t('medizinischeUnterlagen')}</li>
                            <li><span>{t('geschäftsDokumenteTitle')}</span>{t('geschäftsDokumente')}</li>
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
                            <li><span>{t('einreichungTitle')}</span>{t('einreichung')}</li>
                            <button className="hover-btn services-send-btn" onClick={() => navigate('/order')}>UNTERLAGEN EINREICHEN<FaArrowRightLong/></button>
                            <li><span>{t('überprüfungTitle')}</span>{t('überprüfung')}</li>
                            <li><span>{t('übersetzungTitle')}</span>{t('übersetzung')}</li>
                            <li><span>{t('qualitätTitle')}</span>{t('qualität')}</li>
                            <li><span>{t('zertifizierungTitle')}</span>{t('zertifizierung')}</li>
                            <li><span>{t('lieferungTitle')}</span>{t('lieferung')}</li>
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
    )
}


export default Translations