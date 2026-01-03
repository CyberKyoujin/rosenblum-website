import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';
import { BsTranslate } from 'react-icons/bs';
import { FaLanguage } from 'react-icons/fa';
import { TbTools } from 'react-icons/tb';
import ServicesColumn from './ServicesColumn';

interface Props {
    isOpened: boolean;
    setOpened: (open: boolean) => void;
}

const servicesColItems = {
    1: [
        {link: "sworn-translations", linkText: "sworn_translations"},
        {link: "verbal-translations", linkText: "verbalTranslations"},
        {link: "apostille", linkText: "appostile"}
    ],
    2: [
        {link: "languages", linkText: "german"},
        {link: "languages", linkText: "ukrainian"},
        {link: "languages", linkText: "russian"}
    ],
    3: [
        {link: "pricing", linkText: "pricesAndDocuments"},
        {link: "areas", linkText: "expertise"},
        {link: "faq", linkText: "faq"}
    ]
}

const ServicesMenu: React.FC<Props> = ({ isOpened, setOpened }) => {

    const { t } = useTranslation();

    return (
        <div className={isOpened ? 'services-container show-services' : 'services-container'}>

            <div className='services-header'>
                <h4 className="nav-link" style={{fontWeight: 'normal'}}>{t('services')}</h4>
                <IoCloseOutline className="services-close" onClick={() => setOpened(false)}/> 
            </div>

            <div className="services-content">

                <ServicesColumn Icon={BsTranslate} titleText="translations" items={servicesColItems[1]} setOpened={setOpened}/>

                <ServicesColumn Icon={FaLanguage} titleText="languages" items={servicesColItems[2]} setOpened={setOpened}/>
                
                <ServicesColumn Icon={TbTools} titleText="expertise" items={servicesColItems[3]} setOpened={setOpened}/>
                
            </div>
        </div>
    );
};

export default ServicesMenu;