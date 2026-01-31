import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import i18next from 'i18next';

const t = (key: string) => i18next.t(key);

Sentry.init({
  dsn: "https://c9e529fc1ce19beed4677e9a7d2180bf@o4510805923856384.ingest.de.sentry.io/4510805925429328",
  sendDefaultPii: true,
  integrations: [
    Sentry.feedbackIntegration({
     
      triggerLabel: t('sentry_button_label'),
      formTitle: t('sentry_form_title'),
      submitButtonLabel: t('sentry_submit_label'),
     
      cancelButtonLabel: t('sentry_cancel_label'),
      addScreenshotButtonLabel: t('sentry_screenshot_label'),

      emailLabel: t('sentry_email_label'),
      emailPlaceholder: t('sentry_email_placeholder'),
      messageLabel: t('sentry_message_label'),
      messagePlaceholder: t('sentry_message_placeholder'),
      successMessage: t('sentry_success_message'),
      namePlaceholder: "Ihr Name",
      
      colorScheme: "light", 
      themeLight: {
        accentBackground: "#4c79d4",
        submitButtonBackground: "#4c79d4", 
      },
    }),
  ],
  tracesSampleRate: 0.1, 
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <BrowserRouter>
      <App />
    </BrowserRouter>

)
