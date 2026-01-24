import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CookieIcon from '@mui/icons-material/Cookie';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    functional: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        functional: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            setIsVisible(true);
        } else {
            const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
            if (savedPreferences) {
                setPreferences(JSON.parse(savedPreferences));
            }
        }
    }, []);

    const saveConsent = (prefs: CookiePreferences) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
        setPreferences(prefs);
        setIsVisible(false);

        // Dispatch event for other components to react to consent changes
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: prefs }));
    };

    const acceptAll = () => {
        saveConsent({
            necessary: true,
            analytics: true,
            functional: true,
        });
    };

    const acceptNecessary = () => {
        saveConsent({
            necessary: true,
            analytics: false,
            functional: false,
        });
    };

    const saveCustomPreferences = () => {
        saveConsent(preferences);
    };

    const handlePreferenceChange = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Necessary cookies cannot be disabled
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-overlay">
            <div className="cookie-consent-banner">
                <div className="cookie-consent-header">
                    <CookieIcon className="cookie-icon" />
                    <h3>Cookie-Einstellungen</h3>
                </div>

                <div className="cookie-consent-content">
                    <p>
                        Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
                        Einige Cookies sind für den Betrieb der Website notwendig, während andere uns helfen,
                        die Website zu verbessern und Ihnen personalisierte Inhalte anzuzeigen.
                    </p>

                    {showDetails && (
                        <div className="cookie-details">
                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <label className="cookie-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={preferences.necessary}
                                            disabled
                                            className="cookie-checkbox"
                                        />
                                        <span className="cookie-category-title">Notwendige Cookies</span>
                                    </label>
                                    <span className="cookie-badge cookie-badge-required">Erforderlich</span>
                                </div>
                                <p className="cookie-category-description">
                                    Diese Cookies sind für die Grundfunktionen der Website erforderlich,
                                    wie z.B. Benutzeranmeldung und Sitzungsverwaltung.
                                </p>
                            </div>

                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <label className="cookie-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={() => handlePreferenceChange('analytics')}
                                            className="cookie-checkbox"
                                        />
                                        <span className="cookie-category-title">Analyse-Cookies</span>
                                    </label>
                                </div>
                                <p className="cookie-category-description">
                                    Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website
                                    interagieren (Google Analytics, Sentry).
                                </p>
                            </div>

                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <label className="cookie-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={preferences.functional}
                                            onChange={() => handlePreferenceChange('functional')}
                                            className="cookie-checkbox"
                                        />
                                        <span className="cookie-category-title">Funktionale Cookies</span>
                                    </label>
                                </div>
                                <p className="cookie-category-description">
                                    Diese Cookies ermöglichen erweiterte Funktionen wie die Anmeldung
                                    über Google und das Speichern von Präferenzen.
                                </p>
                            </div>
                        </div>
                    )}

                    <p className="cookie-privacy-link">
                        Weitere Informationen finden Sie in unserer{' '}
                        <Link to="/privacy" className="cookie-link">Datenschutzerklärung</Link>.
                    </p>
                </div>

                <div className="cookie-consent-actions">
                    {!showDetails ? (
                        <>
                            <button
                                onClick={() => setShowDetails(true)}
                                className="cookie-btn cookie-btn-settings"
                            >
                                Einstellungen
                            </button>
                            <button
                                onClick={acceptNecessary}
                                className="cookie-btn cookie-btn-reject"
                            >
                                Nur Notwendige
                            </button>
                            <button
                                onClick={acceptAll}
                                className="cookie-btn cookie-btn-accept"
                            >
                                Alle akzeptieren
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="cookie-btn cookie-btn-settings"
                            >
                                Zurück
                            </button>
                            <button
                                onClick={saveCustomPreferences}
                                className="cookie-btn cookie-btn-accept"
                            >
                                Auswahl speichern
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function to check if analytics cookies are allowed
export const isAnalyticsAllowed = (): boolean => {
    const preferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!preferences) return false;
    try {
        const parsed: CookiePreferences = JSON.parse(preferences);
        return parsed.analytics;
    } catch {
        return false;
    }
};

// Helper function to check if functional cookies are allowed
export const isFunctionalAllowed = (): boolean => {
    const preferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!preferences) return false;
    try {
        const parsed: CookiePreferences = JSON.parse(preferences);
        return parsed.functional;
    } catch {
        return false;
    }
};

export default CookieConsent;
