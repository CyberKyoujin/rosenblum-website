import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section footer-brand">
                    <h3 className="footer-logo">Rosenblum</h3>
                    <p className="footer-tagline">{t('footerTagline')}</p>
                    <div className="footer-social">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <InstagramIcon />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FacebookIcon />
                        </a>
                    </div>
                </div>

                <div className="footer-section footer-links-section">
                    <h4>{t('footerQuickLinks')}</h4>
                    <nav className="footer-nav">
                        <Link to="/">{t('home')}</Link>
                        <Link to="/sworn-translations">{t('translations')}</Link>
                        <Link to="/about-us">{t('about')}</Link>
                        <Link to="/contact-us">{t('contactSmall')}</Link>
                    </nav>
                </div>

                <div className="footer-section footer-legal-section">
                    <h4>{t('footerLegal')}</h4>
                    <nav className="footer-nav">
                        <Link to="/privacy">{t('footerPrivacy')}</Link>
                        <Link to="/imprint">{t('footerImprint')}</Link>
                        <Link to="/terms">{t('footerTerms')}</Link>
                    </nav>
                </div>

                <div className="footer-section footer-contact">
                    <h4>{t('contactSmall')}</h4>
                    <div className="footer-contact-item">
                        <EmailIcon />
                        <a href="mailto:rosenblum.uebersetzungsbuero@gmail.com">rosenblum.uebersetzungsbuero@gmail.com</a>
                    </div>
                    <div className="footer-contact-item">
                        <PhoneIcon />
                        <a href="tel:+4917624137205">0176 24137205</a>
                    </div>
                    <div className="footer-contact-item">
                        <LocationOnIcon />
                        <span>Osnabrück, Germany</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Rosenblum. {t('footerRights')}</p>
            </div>
        </footer>
    )
}

export default Footer