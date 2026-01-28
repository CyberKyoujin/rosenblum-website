import { Divider } from "@mui/material";
import Footer from "../components/Footer";
import { GrContactInfo } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import questionIcon from "../assets/question_icon.webp"
import planeIcon from "../assets/planet_icon.webp"
import NavigationSection from "../components/NavigationSection";
import Section from "../components/Section";
import TeamSection from "../components/TeamSection";

const AboutUs = () => {

    const { t } = useTranslation();

    return(
        <>
        <div className="main-app-container">

            <NavigationSection first_link="Über Uns"/>

            <div className="about-main-container">

                <Section image={planeIcon} imageClass="first-image" titleTextFirst="aboutUsFirst" titleTextSecond="aboutUsSecond" text="aboutUsText" order/>

                <Divider style={{marginTop: '3rem', marginBottom: '2rem'}}/>

                <TeamSection />

                <Divider style={{marginTop: '3rem', marginBottom: '2rem'}}/>

                <Section image={questionIcon} imageClass="first-image" titleTextFirst="whyUsFirst" titleTextSecond="whyUsSecond" text="whyUsText" order={true}/>

                <Link to="/contact-us" className="contact-us-btn hover-btn app-link">
                    <GrContactInfo size={35}/>
                    {t('contactUsFull')}
                </Link>
       
            </div>
        </div>
        <Footer/>
        </>
    )
}


export default AboutUs