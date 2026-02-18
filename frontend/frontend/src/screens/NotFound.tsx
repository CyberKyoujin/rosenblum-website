import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <div className="not-found-divider" />
        <h2 className="not-found-title">{t('pageNotFound', 'Seite nicht gefunden')}</h2>
        <p className="not-found-text">
          {t('pageNotFoundText', 'Die angeforderte Seite existiert nicht oder wurde verschoben.')}
        </p>
        <div className="not-found-actions">
          <button className="not-found-btn-primary" onClick={() => navigate('/')}>
            {t('backToHome', 'Zur Startseite')}
          </button>
          <button className="not-found-btn-secondary" onClick={() => navigate(-1)}>
            {t('goBack', 'Zurück')}
          </button>
        </div>
      </div>
    </div>
  );
}
