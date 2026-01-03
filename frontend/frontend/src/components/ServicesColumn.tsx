import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons/lib';
import { Link } from 'react-router-dom';

interface ServicesColumnItem {
    link: string;
    linkText: string;
}

interface ServicesColumnProps{
    Icon: IconType;
    titleText: string;
    items: ServicesColumnItem[];
    setOpened: (open: boolean) => void;
}

const ServicesColumn: React.FC<ServicesColumnProps> = ({Icon, titleText, items, setOpened}) => {
    
    const { t } = useTranslation();
    
    return (
        <div className="services-col">

            <Icon className="translate-icon"/>
            <h5>{t(titleText)}</h5>

            {items.map((item, idx) => (

                <Link to={item.link} key={idx} onClick={() => setOpened(false)} className='app-link'>
                    <p>
                        {t(item.linkText)}
                    </p>
                </Link>
                
            ))}

        </div>
    );
}

export default ServicesColumn;
