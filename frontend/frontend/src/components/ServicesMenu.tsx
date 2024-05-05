import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';
import { BsTranslate } from 'react-icons/bs';
import { FaLanguage } from 'react-icons/fa';
import { TbTools } from 'react-icons/tb';

interface Props {
    isOpened: boolean;
    setOpened: (open: boolean) => void;
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
                <div className="services-col">
                    <BsTranslate className="translate-icon"/>
                    <h5>{t('translations')}</h5>
                    <p>{t('sworn_translations')}</p>
                    <p>{t('verbalTranslations')}</p>
                    <p>{t('appostile')}</p>
                </div>

                <div className="services-col">
                    <FaLanguage className="translate-icon"/>
                    <h5>{t('languages')}</h5>
                    <p>{t('german')}</p>
                    <p>{t('ukrainian')}</p>
                    <p>{t('russian')}</p>
                </div>

                <div className="services-col">
                    <TbTools className="translate-icon"/>
                    <h5>{t('expertise')}</h5>
                    <p>{t('pricesAndDocuments')}</p>
                    <p>{t('expertise')}</p>
                    <p>{t('faq')}</p>
                </div>
            </div>
        </div>
    );
};

export default ServicesMenu;