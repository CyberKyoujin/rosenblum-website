import ReactGA from 'react-ga4';
import { isAnalyticsAllowed } from '../components/CookieConsent';

let initialized = false;

const initGA = () => {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || initialized) return;
  ReactGA.initialize(id);
  initialized = true;
};

export const tryInitGA = () => {
  if (!import.meta.env.PROD) return;
  if (isAnalyticsAllowed()) {
    initGA();
  }
};

export const trackPageView = (path: string) => {
  if (!initialized) return;
  ReactGA.send({ hitType: 'pageview', page: path });
};

if (typeof window !== 'undefined') {
  window.addEventListener('cookieConsentChanged', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.analytics && import.meta.env.PROD) {
      initGA();
    }
  });
}
