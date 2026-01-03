import React from "react";
import { useTranslation } from "react-i18next";

interface SectionProps {
    image: string;
    imageClass: string;
    titleTextFirst: string;
    titleTextSecond: string;
    text: string;
    order: boolean;
}

const Section: React.FC<SectionProps> = ({image, imageClass, titleTextFirst, titleTextSecond, text, order }) => {

    const { t } = useTranslation();

    return (

        <div className="translations-section">
            {order && <img src={image} alt="" fetchPriority="high" className={imageClass}/>}

            <div className="translations-section-text">

                <div className="translations-section-title">
                    <h1>{titleTextFirst}</h1>
                    <h1 className="header-span">{titleTextSecond}</h1>
                </div>

                <p>{t(text)}</p>

            </div> 

            {!order && <img src={image} alt="" className={imageClass} loading="lazy"/>}

        </div>
    )
}


export default Section