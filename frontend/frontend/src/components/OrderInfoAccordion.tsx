import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Typography from '@mui/material/Typography';
import { IoWarningOutline } from "react-icons/io5";
import AccordionDetails from '@mui/material/AccordionDetails';
import ukrPass from '../assets/ukr_pass.webp'
import dePass from '../assets/pass_de.webp'
import { useTranslation } from "react-i18next";

const OrderInfoAccordion = () => {

    const { t } = useTranslation();

    return (
        <div className="info-container">
                <Accordion style={{border: '1px solid rgb(76, 121, 212)', boxShadow:"none", backgroundColor: 'rgb(234, 241, 253)', borderRadius: '0px', display: 'flex', flexDirection:'column', }}>
                        <AccordionSummary
                        expandIcon={<ArrowDownwardIcon style={{color: 'rgb(76, 121, 212)'}}/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        >
                        <Typography style={{display: 'flex', color: 'rgb(49, 97, 192)', alignItems: 'center', gap: '1rem'}}>
                            <IoWarningOutline className="warning-icon"/> 
                            <p>{t('spelling')}</p>
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{padding: '1rem 3rem 2rem 3rem'}}>
                        <Typography className="pass-info">
                            Die richtige Schreibwiesen können Sie in ihrem <span style={{color: 'rgb(49, 97, 192)', fontWeight: '600'}}>Reisepass</span> finden.
                        </Typography>

                        <div className="pass-container">
                            <img src={dePass} alt="" loading="lazy"/>
                            <img src={ukrPass} alt="" loading="lazy"/>
                        </div>

                        </AccordionDetails>
                    </Accordion>
                </div>
    )
}

export default OrderInfoAccordion