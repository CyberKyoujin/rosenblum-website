import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRightLong } from 'react-icons/fa6';
import { IconType } from 'react-icons/lib';

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
    order: boolean;
    badgeText?: string;
    BadgeIcon?: IconType;
}

const ServiceProcessSteps: React.FC<ServiceProcessStepsProps> = ({badgeText, BadgeIcon, steps, link, order, linkText, img, title, titleSpan}) => {

    const { t } = useTranslation();

    return (
        <div className="translations-section">

                    { order && <img src={img} alt=""  className="third-image" loading="lazy"/> }

                    <div className="translations-section-list">
                        <div className="translations-process-title">
                          
                          
                           <div className='process-title-cont'>
                                <h1 className="header-span">{t(title)}</h1>
                                <h1>{t(titleSpan)}</h1>
                           </div>
                            
                           
                        </div>

                        { badgeText && BadgeIcon &&
                            <div className="home-badge" style={{gap: "1rem", width: "90%", padding: "0.5rem 1rem 0.5rem 1.5rem", marginTop: "1.5rem"}}>
                                <p style={{lineHeight: "1.3rem", fontSize: "14px"}}>{t(badgeText)}</p>
                            </div>
                        }

                        <ol className="services-list" style={{lineHeight: '25px', fontSize: '18px', marginLeft: '2rem'}}>


                            {steps.map((item, idx) => (

                                <React.Fragment>

                                    <li><span>{t(item.stepTitle)}</span>{t(item.step)}</li>

                                    {link && idx === 0 && (
                                        <Link to={`/${link}`} className="hover-btn services-send-btn app-link">{t(linkText)}<FaArrowRightLong/></Link>
                                    )}

                                </React.Fragment>        

                            ))}

                        </ol>

                        
                    </div>

                    { !order && <img src={img} alt=""  className="third-image" loading="lazy"/> }

                </div>
    );
}

export default ServiceProcessSteps;
