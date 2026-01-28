import React from "react";
import { useTranslation } from "react-i18next";
import AuthoritiesSection from "./AuthoritiesSection";
import { IconType } from "react-icons/lib";

interface SectionProps {
    image: string;
    imageClass: string;
    titleTextFirst: string;
    titleTextSecond: string;
    text: string;
    order: boolean;
    authorities?: boolean;
    badgeText?: string;
    BadgeIcon?: IconType;
}

const Section: React.FC<SectionProps> = ({badgeText, BadgeIcon, image, authorities, imageClass, titleTextFirst, titleTextSecond, text, order }) => {

    const { t } = useTranslation();

    return (

        <div className="translations-section">
            {order && <img src={image} alt="" fetchPriority="high" className={imageClass}/>}

            <div className="translations-section-text">

                <div className="translations-section-title">
                    <h1>{t(titleTextFirst)}</h1>
                    <h1 className="header-span">{t(titleTextSecond)}</h1>
                </div>

                { badgeText && BadgeIcon &&
                <div className="home-badge" style={{gap: "1rem", padding: "0.5rem 1rem 0.5rem 1.5rem", margin: 0}}>
                    <p style={{lineHeight: "1.3rem", fontSize: "14px"}}>{t(badgeText)}</p>
                </div>
                }

                <p>{t(text)}</p>

                {authorities && <AuthoritiesSection small/>}

            </div> 

            {!order && <img src={image} alt="" className={imageClass} loading="lazy"/>}

        </div>
    )
}


export default Section