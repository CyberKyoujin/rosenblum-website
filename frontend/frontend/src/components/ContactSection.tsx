import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import contact from "../assets/contact.jpg"
import { GrContactInfo } from "react-icons/gr";

interface ContactSectionProps {
    text: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({text}) => {

    const navigate = useNavigate();
    const { t } = useTranslation();


    return (
        <div className="translations-section">

                    <div className="translations-section-text">
                        <div className="translations-section-title">
                            <h1 className="header-span">{t('contactUs')}</h1>
                            <h1>{t('us')}</h1>
                        </div>
                        <p>{t(text)}</p>
                        <button className="contact-us-btn hover-btn" onClick={() => navigate('/contact-us')} style={{padding: '0.75rem', marginTop: '0rem'}}><GrContactInfo style={{fontSize: '35px'}}/>{t('contactUsFull')}</button>

                    </div>

                    <img src={contact} alt="" className="contact-image"/>
                   
        </div>
    )
}


export default ContactSection