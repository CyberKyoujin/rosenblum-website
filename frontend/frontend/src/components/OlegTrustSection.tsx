import { useTranslation } from 'react-i18next';
import { BsCheckCircleFill } from 'react-icons/bs';
import oleg from '../assets/oleg.webp';

const OlegTrustSection = () => {
    const { t } = useTranslation();

    const points = [
        t('olegTrust.point1'),
        t('olegTrust.point2'),
        t('olegTrust.point3'),
        t('olegTrust.point4'),
    ];

    return (
        <section className="oleg-trust">
            <div className="oleg-trust__inner">


                <div className="oleg-trust__content">
                    <span className="oleg-trust__label">{t('olegTrust.label')}</span>
                    <h2 className="oleg-trust__name">{t('team.oleg.name')}</h2>
                    <p className="oleg-trust__role">{t('team.oleg.role')}</p>

                    <ul className="oleg-trust__points">
                        {points.map((point, i) => (
                            <li key={i} className="oleg-trust__point">
                                <BsCheckCircleFill className="oleg-trust__check" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>


                <div className="oleg-trust__photo-wrap">
                    <img src={oleg} alt={t('team.oleg.name')} className="oleg-trust__photo" />
                </div>

                
            </div>
        </section>
    );
};

export default OlegTrustSection;
