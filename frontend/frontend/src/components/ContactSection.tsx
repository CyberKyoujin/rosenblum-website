import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import contactIcon from "../assets/contact_image.webp"
import { GrContactInfo } from "react-icons/gr";

interface ContactSectionProps {
    text: string;
    order: boolean;
}

const ContactSection: React.FC<ContactSectionProps> = ({text, order}) => {

    const navigate = useNavigate();
    const { t } = useTranslation();


    return (
        <div className="translations-section">

            {order && <img src={contactIcon} alt="" className="contact-image" loading="lazy"/>}

            <div className="translations-section-text">

                <div className="translations-section-title">
                    <h1 className="header-span">{t('contactUs')}</h1>
                    <h1>{t('us')}</h1>
                </div>

                <p>{t(text)}</p>

                <button className="contact-us-btn hover-btn" onClick={() => navigate('/contact-us')} style={{padding: '0.75rem', marginTop: '0rem'}}>
                    <GrContactInfo size={35}/>{t('contactUsFull')}
                </button>

            </div>

            {!order && <img src={contactIcon} alt="" className="contact-image" loading="lazy"/>}
                   
        </div>
    )
}


export default ContactSection