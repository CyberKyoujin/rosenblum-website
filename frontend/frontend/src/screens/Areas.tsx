import React from "react";
import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import Section from "../components/Section"
import ContactSection from "../components/ContactSection";
import areas_second from "../assets/areas_second.jpg"
import { VscLaw } from "react-icons/vsc";
import areas_first from "../assets/areas_first.jpg"
import Footer from "../components/Footer";
import { RiMedicineBottleFill } from "react-icons/ri";
import areas_third from "../assets/areas_third.jpg"
import { FaBook } from "react-icons/fa6";


const Areas = () => {
    
    const { t } = useTranslation();

    return (
        <>
        <div className="main-app-container">
            <div className="areas-main-container">
                <div className="areas-title">
                    <h1>{t('our')}</h1>
                    <h1 className="header-span">{t('areasTitle')}</h1>
                </div>

                <div className="areas-section">
                    <p>
                        {t('areas')}
                    </p>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '3rem'}}/>

                <div className="areas-main-section">
                    <img src={areas_second} alt="" />

                    <div className="areas-text-section">
                        <div className="areas-section-title">
                            <h1 className="header-span"><VscLaw/> {t('law')}</h1>
                        </div>

                        <div className="areas-item">
                            <p><span>{t('specialization')}</span> {t('rechtDocs')}</p>
                        </div>

                        <div className="areas-item">
                            <p><span>{t('description')}</span> {t('rechtDescription')}</p>
                            
                        </div>
                    </div>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '3rem'}}/>

                <div className="areas-main-section">

                    <div className="areas-text-section">
                        <div className="areas-section-title">
                            <h1 className="header-span"><RiMedicineBottleFill/> {t('medicine')}</h1>
                        </div>

                        <div className="areas-item">
                            <p><span>{t('specialization')}</span> {t('medizinDocs')}</p>
                        </div>

                        <div className="areas-item">
                            <p><span>{t('description')}</span> {t('medizinDescription')}</p>
                            
                        </div>
                    </div>

                    <img src={areas_first} alt="" />

                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '3rem'}}/>

                <div className="areas-main-section">

                    <img src={areas_third} alt="" />

                    <div className="areas-text-section">
                        <div className="areas-section-title">
                            <h1 className="header-span"><FaBook/> {t('education')}</h1>
                        </div>

                        <div className="areas-item">
                            <p><span>{t('specialization')}</span> {t('educationDocs')}</p>
                        </div>

                        <div className="areas-item">
                            <p><span>{t('description')}</span> {t('educationDescription')}</p>
                            
                        </div>
                    </div>

                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '1rem'}}/>

                <ContactSection text="areasContact"/>

            </div>
        </div>
        <Footer/>
        </>
    )
}


export default Areas