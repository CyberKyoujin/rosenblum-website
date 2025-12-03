import ua from "../assets/ua.svg"
import ru from "../assets/ru.svg"
import de from "../assets/de.svg"
import Divider from '@mui/material/Divider';
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";
import qualityIcon from "../assets/quality_image.webp"
import questionIcon from "../assets/question_icon.webp"
import NavigationSection from "../components/NavigationSection";

const Languages = () => {

    const { t } = useTranslation();

    return (
        <>
        <div className="main-app-container">

            <NavigationSection first_link="Sprachen"/>

            <div className="languages-main-container">

                <div className="languages-section">

                    <div className="languages-section-title">
                        <h1>{t('ourTwo')}</h1>
                        <h1 className="header-span">{t('languagePortfolio')}</h1>
                    </div>

                    <div className="languages-items">

                        <div className="languages-item">
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={de} alt="Deutsch" loading="lazy"/>
                                    </div>
                                    <div className="flip-card-back">
                                        <p>{t('moreThan')}</p>
                                        <p style={{fontWeight: 'bold', color: 'RGB(44 100 213)'}}>2000</p>
                                        <p>{t('translationsTwo')}</p>
                                    </div>
                                </div>
                            </div>
                            <p>{t('german')}</p>
                        </div>

                        <div className="languages-item">
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={ua} alt="Ukrainisch" loading="lazy" />
                                    </div>
                                    <div className="flip-card-back">
                                        <p>{t('moreThan')}</p>
                                        <p style={{fontWeight: 'bold', color: 'RGB(44 100 213)'}}>5000</p>
                                        <p>{t('translationsTwo')}</p>
                                    </div>
                                </div>
                            </div>
                            <p>{t('ukrainian')}</p>
                        </div>

                        <div className="languages-item">
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={ru} alt="Russisch" loading="lazy"/>
                                    </div>
                                    <div className="flip-card-back">
                                        <p>{t('moreThan')}</p>
                                        <p style={{fontWeight: 'bold', color: 'RGB(44 100 213)'}}>1000</p>
                                        <p>{t('translationsTwo')}</p>
                                    </div>
                                </div>
                            </div>
                            <p>{t('russian')}</p>
                        </div>

                    </div>

                </div>

                <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                <Section image={questionIcon} imageClass="second-image" titleTextFirst={t('whyDiversity')} titleTextSecond={t('importantIs')} text="vielfalt" order={false}/>


                <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                <div className="translations-section" style={{gap: '2rem'}}>

                    <img src={qualityIcon} alt="" className="third-image" loading="lazy"/>

                    <div className="translations-section-text">
                            <div className="translations-section-title">
                                <h1>{t('our')}</h1>
                                <h1 className="header-span">{t('responsibility')}</h1>
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

                <ContactSection text="translationsContact"/>

            </div>
          
        </div>
        <Footer/>  
        </>

    );
}



export default Languages