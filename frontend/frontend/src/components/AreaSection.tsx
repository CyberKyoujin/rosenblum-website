import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons/lib';

interface AreaSectionProps {
    img: string;
    Icon: IconType;
    title: string;
    specialisation: string;
    description: string;
    alignImageRight?: boolean | false;
}

const AreaSection: React.FC<AreaSectionProps> = ({img, Icon, title, specialisation, description, alignImageRight}) => {

    const { t } = useTranslation();

    return (
        <div className="areas-main-section">

                    { !alignImageRight && <img  className="third-image" src={img} alt="" loading="lazy"/>}

                    <div className="areas-text-section">
                        <div className="areas-section-title">
                            <h1 className="header-span"><Icon/> {t(title)}</h1>
                        </div>

                        <div className="areas-item">
                            <p><span>{t('specialization')}</span> {t(specialisation)}</p>
                        </div>

                        <div className="areas-item">
                            <p><span>{t('description')}</span> {t(description)}</p>
                            
                        </div>
                    </div>

                    { alignImageRight && <img src={img} alt="" loading="lazy"/>}

                </div>
    );
}

export default AreaSection;
