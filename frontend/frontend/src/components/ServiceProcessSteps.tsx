import React from 'react';
import gears from "../assets/gears.gif"
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRightLong } from 'react-icons/fa6';

interface Step {
    stepTitle: string;
    step: string;
}

interface ServiceProcessStepsProps {
    steps: Step[];
    link?: string;
    linkText: string | "";
    addProcessIcon: boolean;
    img: string;
    title: string;
    titleSpan: string;
}

const ServiceProcessSteps: React.FC<ServiceProcessStepsProps> = ({steps, link, linkText, addProcessIcon, img, title, titleSpan}) => {

    const { t } = useTranslation();

    return (
        <div className="translations-section">

                    <img src={img} alt=""  className="third-image" loading="lazy"/> 

                    <div className="translations-section-list">
                        <div className="translations-process-title">

                            {addProcessIcon && <img src={gears} alt="" style={{width: '70px'}} loading="lazy"/>}
                          
                          
                           <div className='process-title-cont'>
                                <h1 className="header-span">{t(title)}</h1>
                                <h1>{t(titleSpan)}</h1>
                           </div>
                            
                           
                        </div>
                        <ol className="services-list" style={{lineHeight: '25px', fontSize: '18px', marginLeft: '2rem'}}>


                            {steps.map((item, idx) => (

                                <React.Fragment>

                                    <li><span>{t(item.stepTitle)}</span>{t(item.step)}</li>

                                    {link && idx === 0 && (
                                        <Link to={link} className="hover-btn services-send-btn app-link">{t(linkText)}<FaArrowRightLong/></Link>
                                    )}

                                </React.Fragment>        

                            ))}

                        </ol>
                    </div>

                </div>
    );
}

export default ServiceProcessSteps;
