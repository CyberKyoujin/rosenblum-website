import React from "react";
import translations_first from '../assets/register_icon.jpg'
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
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";

const Translations = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <>

        <div className="main-app-container">

            <div role="presentation" className="profile-navigation">
                <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography color="text.primary">{t('sworn_translations')}</Typography>
                </Breadcrumbs>
            </div>


            <div className="main-translations-container">

                <Section image={translations_first} imageClass="first-image" titleTextFirst={t('sworn')} titleTextSecond={t('translations')} text="translationsFirstSection" order={true}/>

                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <Section image={translations_second} imageClass="second-image" titleTextFirst={t('whatAre')} titleTextSecond={t('swornTranslations') + '?'} text="whatAreTranslations" order={false}/>

                <Divider style={{marginTop: '2rem', marginBottom: '3rem'}}/>

                <div className="translations-services">

                    <div className="translations-services-title">
                        <h2 className="header-span">{t('ourSevices')}</h2>
                        <h2>{t('forSwornTranslations')}</h2>
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
                           
                            <h1 className="header-span">{t('soWorks')}</h1>
                            <h1>{t('it')}</h1>
                           
                        </div>
                        <ol className="services-list" style={{lineHeight: '25px', fontSize: '18px', marginLeft: '2rem'}}>
                            <li><span>{t('einreichungTitle')}</span>{t('einreichung')}</li>
                            <button className="hover-btn services-send-btn" onClick={() => navigate('/order')}>{t('sendDokuments')}<FaArrowRightLong/></button>
                            <li><span>{t('überprüfungTitle')}</span>{t('überprüfung')}</li>
                            <li><span>{t('übersetzungTitle')}</span>{t('übersetzung')}</li>
                            <li><span>{t('qualitätTitle')}</span>{t('qualität')}</li>
                            <li><span>{t('zertifizierungTitle')}</span>{t('zertifizierung')}</li>
                            <li><span>{t('lieferungTitle')}</span>{t('lieferung')}</li>
                        </ol>
                    </div>

                </div>

                <Divider style={{marginTop: '4rem', marginBottom: '1rem'}}/>

                <ContactSection text="translationsContact"/>

                
            </div>
        </div>
        <Footer/>
        </>
        
    )
}


export default Translations