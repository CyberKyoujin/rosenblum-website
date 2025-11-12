import React from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section";
import quality from "../assets/faq_first.jpg"
import { GrContactInfo } from "react-icons/gr";
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { styled } from '@mui/system';
import { FaLanguage } from "react-icons/fa6";
import { MdLocalOffer } from "react-icons/md";
import { RiMoneyEuroCircleFill } from "react-icons/ri";
import { SiGoogletranslate } from "react-icons/si";
import { RiContactsFill } from "react-icons/ri";


const StyledAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: 'rgb(234,241,253)',
    padding: '0.75rem',
    color: 'RGB(45 101 213)',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    
}))

const StyledAccordionDetails = styled(Typography)(({ theme }) => ({
    paddingRight: '3rem',
    paddingLeft: '1rem',
    paddingBottom: '2rem'
}))

const Faq = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
        <div className="main-app-container">
            <div className="main-faq-container">

               
                <div className="faq-title">
                    <h1 className="header-span">FAQ</h1>
                    <h1 className="faq-title-description">{"(" + t('questions') + ")"}</h1>
                </div>
                

                <div>
                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        >
                        <StyledTypography>{t('accordionTitleFirst')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextFirst')}
                            <p style={{marginTop: '1rem'}}><span style={{fontWeight: 'bold'}}>Email:</span> olegrosenblum@freenet.de</p>
                            <button className="accordion-btn hover-btn"><MdLocalOffer style={{fontSize: '25px'}}/>{t('offer')}</button>
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t('accordionTitleSecond')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextSecond')}
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t('accordionTitleThird')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextThird')}
                            <button className="accordion-btn hover-btn" onClick={() => navigate('/languages')}><FaLanguage style={{fontSize: '25px'}}/> {t('ourLanguages')}</button>
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t('accordionTitleFourth')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextFourth')}
                            <button className="accordion-btn hover-btn" onClick={() => navigate('/pricing')}><RiMoneyEuroCircleFill style={{fontSize: '25px'}}/>{t('ourPrices')}</button>
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t('accordionTitleFifth')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextFifth')}
                            <button className="accordion-btn hover-btn" onClick={() => navigate('/sworn-translations')}><SiGoogletranslate style={{fontSize: '25px', textTransform:'capitalize'}}/>{t('sworn_translations')}</button>
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t('accordionTitleSixth')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextSixth')}
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t('accordionTitleSeventh')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextSeventh')}
                            <button className="accordion-btn hover-btn" onClick={() => navigate('/sworn-translations')}><SiGoogletranslate style={{fontSize: '25px'}}/>{t('verbalTranslations')}</button>
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t('accordionTitleEights')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextEights')}
                            <button className="accordion-btn hover-btn" onClick={() => navigate('/contact-us')}><RiContactsFill style={{fontSize: '25px'}}/>{t('contactUs')}</button>
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion className="faq-accordion">
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon sx={{color: 'RGB(76 121 212)'}}/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t('accordionTitleNinth')}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>
                            {t('accordionTextNinth')}  
                        </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                </div>

                <Divider style={{marginBottom: '3rem', marginTop: '4rem'}}/>

                <div className="faq-section">
                    <div className="faq-section-text">
                        <div className="faq-section-title">
                            <h1>{t('have')}</h1>
                            <h1 className="header-span">{t('questionsTwo')}</h1>
                        </div>
                        <p>{t('faqText')}</p>
                        <button className="contact-us-btn hover-btn" onClick={() => navigate('/contact-us')} style={{padding: '0.75rem', marginTop: '0rem'}}><GrContactInfo style={{fontSize: '35px'}}/>{t('contactUsFull')}</button>
                    </div>
                    <img src={quality} alt="" className="faq-section-image"/>
                </div>



            </div>
        </div>
        <Footer/>
        </>
    )
}


export default Faq