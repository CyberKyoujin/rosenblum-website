import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Footer from "../components/Footer";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import gears from "../assets/gears.gif"
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";
import planetIcon from "../assets/planet_icon.webp"
import questionIcon from "../assets/question_icon.webp"
import processIcon from "../assets/process_image.webp"
import NavigationSection from "../components/NavigationSection";


const Translations = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <>

        <div className="main-app-container">

            <NavigationSection first_link="Beglaubigte Übersetzungen"/>


            <div className="main-translations-container">

                <Section image={planetIcon} imageClass="first-image" titleTextFirst={t('sworn')} titleTextSecond={t('translations')} text="translationsFirstSection" order={true}/>

                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <Section image={questionIcon} imageClass="second-image" titleTextFirst={t('whatAre')} titleTextSecond={t('swornTranslations') + '?'} text="whatAreTranslations" order={false}/>

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

                    <img src={processIcon} alt=""  className="third-image" loading="lazy"/>

                    <div className="translations-section-list">
                        <div className="translations-process-title">
                            <img src={gears} alt="" style={{width: '70px'}} loading="lazy"/>
                           
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