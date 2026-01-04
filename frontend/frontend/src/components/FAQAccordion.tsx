import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { MdLocalOffer } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface AccordionItem{
    title: string;
    text: string;
    secondaryText?: boolean | false;
    link?: string;
}

const accordionItems: AccordionItem[] = [
    {title: "accordionTitleFirst", text: "accordionTextFirst", secondaryText: true, link: "order"},
    {title: "accordionTitleSecond", text: "accordionTextSecond"},
    {title: "accordionTitleThird", text: "accordionTextThird", link: "languages"},
    {title: "accordionTitleFourth", text: "accordionTextFourth", link: "pricing"},
    {title: "accordionTitleFifth", text: "accordionTextFifth", link: "sworn-translations"},
    {title: "accordionTitleSixth", text: "accordionTextSixth"},
    {title: "accordionTitleSeventh", text: "accordionTextSeventh", link: "sworn-translations"},
    {title: "accordionTitleEights", text: "accordionTextEights", link: "contact-us"},
    {title: "accordionTitleNinth", text: "accordionTextNinth"},
]

const StyledAccordion = styled(Accordion)(( ) => ({
    backgroundColor: 'rgb(234,241,253)',
    padding: '0.75rem',
    color: 'RGB(45 101 213)',
}));

const StyledTypography = styled(Typography)(( ) => ({
    fontWeight: 'bold',
    
}))

const StyledAccordionDetails = styled(Typography)(( ) => ({
    paddingRight: '3rem',
    paddingLeft: '1rem',
    paddingBottom: '2rem'
}))

const FAQAccordion: React.FC = () => {

    const { t } = useTranslation();

    return (
        <div>

            {accordionItems.map((item, idx) => (
                <StyledAccordion className="faq-accordion" key={idx}>
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon className="app-icon"/>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                        <StyledTypography>{t(item.title)}</StyledTypography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                        <Typography>

                            {t(item.text)}

                            {item.secondaryText && (
                                

                                    <p style={{marginTop: '1rem'}}><span style={{fontWeight: 'bold'}}>Email:</span> olegrosenblum@freenet.de</p>
                                    
                                
                                
                            )}

                            {item.link && <Link to={item.link} className="accordion-btn hover-btn"><MdLocalOffer size={25}/>{t('offer')}</Link>}

                        </Typography>

                        </StyledAccordionDetails>
                    </StyledAccordion>
            ))}
            
        </div>
    );
}

export default FAQAccordion;
