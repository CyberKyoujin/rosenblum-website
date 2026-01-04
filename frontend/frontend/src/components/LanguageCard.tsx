import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageCardProps {
    image: string;
    translationsCount: number;
    language: string;
}

const LanguageCard: React.FC<LanguageCardProps> = ({image, translationsCount, language}) => {

    const { t } = useTranslation();

    return (
        <div className="languages-item">

            <div className="flip-card">

                <div className="flip-card-inner">

                    <div className="flip-card-front">
                        <img src={image} alt="Deutsch" loading="lazy"/>
                    </div>

                    <div className="flip-card-back">
                        <p>{t('moreThan')}</p>
                        <p style={{fontWeight: 'bold', color: 'RGB(44 100 213)'}}>{translationsCount}</p>
                        <p>{t('translationsTwo')}</p>
                    </div>

                </div>

            </div>

            <p>{t(language)}</p>

        </div>
    );
}

interface LanguageCardsSectionProps {
    cards: LanguageCardProps[]
}

const LanguageCardsSection: React.FC<LanguageCardsSectionProps> = ({cards}) => {

    const { t } = useTranslation();

    return (
        <div className="languages-section">

                    <div className="languages-section-title">
                        <h1>{t('ourTwo')}</h1>
                        <h1 className="header-span">{t('languagePortfolio')}</h1>
                    </div>

                    <div className="languages-items">

                        {cards.map((card, idx) => (
                            <LanguageCard image={card.image} translationsCount={card.translationsCount} language={card.language} key={idx}/>
                        ))}

                    </div>

                </div>

    )
}

export default LanguageCardsSection;
