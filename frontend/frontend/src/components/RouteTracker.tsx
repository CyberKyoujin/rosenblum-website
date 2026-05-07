import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
import { isAnalyticsAllowed } from './CookieConsent';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (isAnalyticsAllowed()) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null;
}
