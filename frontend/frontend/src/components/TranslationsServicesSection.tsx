import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationsServicesItem {
    itemTitle: string;
    item: string;
}

interface TranslationsServicesSectionProps {
    title: string;
    titleSpan: string;
    items: TranslationsServicesItem[];
}

const TranslationsServicesSection: React.FC<TranslationsServicesSectionProps> = ({title, titleSpan, items}) => {

    const { t } = useTranslation();

    return (
        <div className="translations-services">

                    <div className="translations-services-title">
                        <h2 className="header-span">{t(titleSpan)}</h2>
                        <h2>{t(title)}</h2>
                    </div>

                    <div className="translations-services-content">
                        <ol className="services-list">

                            {items.map((item, idx) => (

                                <li key={idx}>
                                    <span>{t(item.itemTitle)}</span>{t(item.item)}
                                </li>

                            ))}
              
                        </ol>
                    </div>

                </div>
    );
}

export default TranslationsServicesSection;
