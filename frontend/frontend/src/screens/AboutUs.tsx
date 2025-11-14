import { Divider } from "@mui/material";
import Footer from "../components/Footer";
import { GrContactInfo } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useTranslation } from "react-i18next";
import teamIcon from "../assets/team_icon.png"
import goalIcon from "../assets/goal_icon.png"
import questionIcon from "../assets/question_icon.png"
import planeIcon from "../assets/planet_icon.jpg"

const AboutUs = () => {


    const navigate = useNavigate();
    const { t } = useTranslation();

    return(
        <>
        <div className="main-app-container">

            <div role="presentation" className="profile-navigation">
                <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography color="text.primary">Über uns</Typography>
                </Breadcrumbs>
            </div>

            <div className="about-main-container">
                
                <div className="about-container">
                    <img src={planeIcon} alt="" />
                    <div className="about-text">
                        <div className="about-header">
                            <h1>{t('aboutUsFirst')}</h1>
                            <h1 className="header-span">{t('aboutUsSecond')}</h1>
                        </div>
                        <p>{t('aboutUsText')}</p>
                    </div>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '2rem'}}/>

                <div className="about-container about-container-gap">
                    <div className="about-text">
                        <div className="about-header">
                            <h1>{t('teamFirst')}</h1>
                            <h1 className="header-span">{t('teamSecond')}</h1>
                        </div>
                        <p>{t('teamText')}</p>
                    </div>
                    <img src={teamIcon} alt=""/>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '2rem'}}/>

                <div className="about-container about-container-gap">
                    <img src={goalIcon} alt=""/>
                    <div className="about-text">
                        <div className="about-header">
                            <h1>{t('missionFirst')}</h1>
                            <h1 className="header-span">{t('missionSecond')}</h1>
                        </div>
                        <p>{t('missionText')}</p>
                    </div>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '3rem'}}/>

                <div className="about-container about-container-gap">
                    <div className="about-text">
                        <div className="about-header">
                            <h1>{t('whyUsFirst')}</h1>
                            <h1 className="header-span">{t('whyUsSecond')}</h1>
                        </div>
                        <p>{t('whyUsText')}</p>
                    </div>
                    <img src={questionIcon} alt=""/>
                </div>

                <button className="contact-us-btn hover-btn" onClick={() => navigate('/contact-us')}><GrContactInfo style={{fontSize: '35px'}}/>{t('contactUsFull')}</button>

       
            </div>
        </div>
        <Footer/>
        </>
    )
}


export default AboutUs