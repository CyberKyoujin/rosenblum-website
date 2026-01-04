import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import ContactSection from "../components/ContactSection";
import { VscLaw } from "react-icons/vsc";
import Footer from "../components/Footer";
import { RiMedicineBottleFill } from "react-icons/ri";
import { FaBook } from "react-icons/fa6";
import medicineIcon from "../assets/medicine_icon.webp"
import lawIcon from "../assets/law_icon.webp"
import educationIcon from "../assets/education_icon.webp"
import NavigationSection from "../components/NavigationSection";
import AreaSection from "../components/AreaSection";

const Areas = () => {
    
    const { t } = useTranslation();

    return (
        <>
        <div className="main-app-container">

            <NavigationSection first_link="Fachgebiete"/>

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

                <AreaSection img={lawIcon} Icon={VscLaw} title="law" specialisation="rechtDocs" description="rechtDescription"/>

                <Divider style={{marginTop: '3rem', marginBottom: '3rem'}}/>

                <AreaSection img={medicineIcon} Icon={RiMedicineBottleFill} title="medicine" specialisation="medizinDocs" description="medizinDescription" alignImageRight/>

                <Divider style={{marginTop: '3rem', marginBottom: '3rem'}}/>

                <AreaSection img={educationIcon} Icon={FaBook} title="education" specialisation="educationDocs" description="educationDescription"/>

                <Divider style={{marginTop: '3rem', marginBottom: '1rem'}}/>

                <ContactSection text="areasContact"/>

            </div>
        </div>
        <Footer/>
        </>
    )
}


export default Areas