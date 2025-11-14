import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import ContactSection from "../components/ContactSection";
import { VscLaw } from "react-icons/vsc";
import Footer from "../components/Footer";
import { RiMedicineBottleFill } from "react-icons/ri";
import { FaBook } from "react-icons/fa6";
import medicineIcon from "../assets/medicine_icon.png"
import lawIcon from "../assets/law_icon.png"
import educationIcon from "../assets/education_icon.png"

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
                    <img src={lawIcon} alt="" />

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

                    <img src={medicineIcon} alt="" />

                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '3rem'}}/>

                <div className="areas-main-section">

                    <img src={educationIcon} alt="" />

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