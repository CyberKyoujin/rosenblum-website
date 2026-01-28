import { useTranslation } from 'react-i18next';

const badges = [
    "Jobcenter",
    "Agentur für Arbeit",
    "BAMF",
    "Standesamt",
    "Uni-Assist",
    "Ausländerbehörde"
]

interface AuthoritiesSectionProps {
    small?: boolean;
}

const AuthoritiesSection = ({small}: AuthoritiesSectionProps) => {

    const {t} = useTranslation();

    return (
        <div className="trust-badges-section" style={small ? {margin: 0, padding: "0.5rem"} : undefined}>

            <p className="trust-badges-title" style={small ? {marginBottom: "0.5rem", fontSize: "14px"}: undefined}>
                {t('trustBadgesTitle')}
            </p>

            <div className="trust-badges-container" style={small ? {gap: "1rem", paddingBottom: "0.5rem"}: undefined}>

                {badges.map((badge, idx) => (
                    <div className="trust-badge" key={idx} style={small ? {padding: "0rem 1rem 0rem 1rem"}: undefined}>
                        <span className="trust-badge-text" style={small ? {fontSize: "12px"}: undefined}>{badge}</span>
                    </div>
                ))}

                
            </div>
        </div>
    );
}

export default AuthoritiesSection;
