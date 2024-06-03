import React from "react";
import { FaMoneyBillWave } from "react-icons/fa6";
import { HiBadgeCheck } from "react-icons/hi";
import Divider from '@mui/material/Divider';
import contact from "../assets/contact.jpg"
import { useNavigate } from "react-router-dom";
import { GrContactInfo } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import Section from "../components/Section"
import pricing_first from "../assets/pricing_first.jpg"

const Pricing = () => {


    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
        <div style={{padding: '1rem 2rem'}}>

            <div className="main-pricing-container">

                <div className="pricing-title">
                        <h1>{t('our')}</h1>
                        <h1 className="header-span">{t('prices')}</h1>
                </div>

                <div className="pricing-container">

                    <div className="pricing-item">
                        <div className="pricing-card-header">
                            <h1>35,30€</h1>
                            <p className="tax">inkl. MwSt.</p>
                            <p>{"/ " + t('document')}</p>
                        </div>
                        <div className="pricing-card-description">
                            <p>{t('standardDocuments')}</p>
                        </div>
                        <div className="pricing-card-bottom">
                            <div className="pricing-card-list">
                                <p><HiBadgeCheck className="check-icon"/> {t('birth')}</p>
                                <p><HiBadgeCheck className="check-icon"/> {t('marry')}</p>
                                <p><HiBadgeCheck className="check-icon"/> {t('registration')}</p>
                            </div>
                            <button className="offer-btn hover-btn" onClick={() => navigate('/order')}>{t('offer')}</button>
                        </div>
                    </div>

                    <div className="pricing-item">
                        <div className="pricing-card-header">
                            <h1>1,40€</h1>
                            <p className="tax">inkl. MwSt.</p>
                            <p>/ {t('line')}</p>
                        </div>
                        <div className="pricing-card-description">
                            <p>{t('variableDocuments')}</p>
                        </div>
                        <div className="pricing-card-bottom">
                            <div className="pricing-card-list">
                                <p><HiBadgeCheck className="check-icon"/> {t('workBook')}</p>
                                <p><HiBadgeCheck className="check-icon"/> {t('educationDocuments')}</p>
                                <p><HiBadgeCheck className="check-icon"/> {t('certificates')}</p>
                            </div>
                            <button className="offer-btn hover-btn" onClick={() => navigate('/order')}>{t('offer')}</button>
                        </div>
                    </div>

                    <div className="pricing-item pricing-item-blue">
                        <div className="pricing-card-header">
                            <h1>{t('uponRequest')}</h1>
    
                        </div>

                        <div className="pricing-card-description">
                            <p>{t('complicatedDocuments')}</p>
                        </div>

                        <div className="pricing-card-bottom">
                            <div className="pricing-card-list">
                                <p><HiBadgeCheck className="check-icon"/> {t('diploma')}</p>
                                <p><HiBadgeCheck className="check-icon"/> {t('court')}</p>
                                <p><HiBadgeCheck className="check-icon"/> {t('findings')}</p>
                            </div>
                            <button className="offer-btn hover-btn" onClick={() => navigate('/order')}>{t('offer')}</button>
                        </div>
                    </div>

                </div>

                <Divider style={{marginTop: '4rem'}}/>
                

                <Section image={pricing_first} imageClass="second-image" titleTextFirst={t('quality')} titleTextSecond={t('satisfaction')} text="qualityAndHappiness" order={true}/>


                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <ContactSection text="pricingContact"/>

            </div>
            
        </div>
        <Footer/>
        </>
    )
}


export default Pricing;


