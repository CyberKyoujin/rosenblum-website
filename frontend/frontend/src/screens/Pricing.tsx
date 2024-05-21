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
                        <h1>Unsere</h1>
                        <h1 className="header-span">Preise</h1>
                </div>

                <div className="pricing-container">

                    <div className="pricing-item">
                        <div className="pricing-card-header">
                            <h1>35,30€</h1>
                            <p className="tax">inkl. MwSt.</p>
                            <p>/Dokument</p>
                        </div>
                        <div className="pricing-card-description">
                            <p>Standarddokumente, deren Textumfang in der Regel gleichbleibend ist.</p>
                        </div>
                        <div className="pricing-card-bottom">
                            <div className="pricing-card-list">
                                <p><HiBadgeCheck className="check-icon"/> Geburtsurkunden</p>
                                <p><HiBadgeCheck className="check-icon"/> Heiratsurkunden</p>
                                <p><HiBadgeCheck className="check-icon"/> Meldebescheinigungen</p>
                            </div>
                            <button className="offer-btn hover-btn" onClick={() => navigate('/order')}>ANGEBOT</button>
                        </div>
                    </div>

                    <div className="pricing-item">
                        <div className="pricing-card-header">
                            <h1>1,40€</h1>
                            <p className="tax">inkl. MwSt.</p>
                            <p>/ Zeile</p>
                        </div>
                        <div className="pricing-card-description">
                            <p>Dokumente mit variablem Textumfang, deren Preis nach dem Umfang des fertigen Übersetzungstextes berechnet wird.</p>
                        </div>
                        <div className="pricing-card-bottom">
                            <div className="pricing-card-list">
                                <p><HiBadgeCheck className="check-icon"/> Arbietsbuch</p>
                                <p><HiBadgeCheck className="check-icon"/> Bildungsdokumente</p>
                                <p><HiBadgeCheck className="check-icon"/> Bescheinigungen</p>
                            </div>
                            <button className="offer-btn hover-btn" onClick={() => navigate('/order')}>ANGEBOT</button>
                        </div>
                    </div>

                    <div className="pricing-item pricing-item-blue">
                        <div className="pricing-card-header">
                            <h1>Auf Anfrage</h1>
    
                        </div>

                        <div className="pricing-card-description">
                            <p>Dokumente mit komplexem Inhalt, deren Preis jeweils individuell berechnet wird.</p>
                        </div>

                        <div className="pricing-card-bottom">
                            <div className="pricing-card-list">
                                <p><HiBadgeCheck className="check-icon"/> Diplome</p>
                                <p><HiBadgeCheck className="check-icon"/> Gerichtsurteile</p>
                                <p><HiBadgeCheck className="check-icon"/> Medizinische Befunde</p>
                            </div>
                            <button className="offer-btn hover-btn" onClick={() => navigate('/order')}>ANGEBOT</button>
                        </div>
                    </div>

                </div>

                <Divider style={{marginTop: '4rem'}}/>
                

                <Section image={pricing_first} imageClass="second-image" titleTextFirst="Qualität und" titleTextSecond="Zufriedenheit" text="qualityAndHappiness" order={true}/>


                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <ContactSection text="pricingContact"/>

            </div>
            
        </div>
        <Footer/>
        </>
    )
}


export default Pricing;


