import React, { SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


interface SliderLinkItem {
    link: string;
    linkText: string;
    image?: string;
}

interface SliderLinksSectionProps {
    sectionLinks: SliderLinkItem[];
    toggleSlider: (open: boolean) => void;
}

const SliderLinksSection: React.FC<SliderLinksSectionProps> = ({sectionLinks, toggleSlider}) => {
   
   const {t} = useTranslation();
   
    return (
        <div className="slider-item">

            {sectionLinks.map((link) => (

                <Link to={link.link} onClick={() => toggleSlider(false)} className='slider-link-item'>
                    
                    <p>
                        {link.image && <img src={link.image} loading="lazy" alt="" />}
                        {t(link.linkText)}
                    </p>
                
                </Link>

            ))}
            
        </div>
    );
}

export default SliderLinksSection;
