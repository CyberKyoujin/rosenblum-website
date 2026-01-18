import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useTranslation } from 'react-i18next';
import { ApiErrorResponse } from '../types/error';

interface ApiErrorAlertProps {
  error?: ApiErrorResponse | null;
  successMessage?: string | null;
  belowNavbar?: boolean;
  onClose?: () => void;
  fixed?: boolean;
  action?: React.ReactNode;
  duration?: number;
}

const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error, successMessage, belowNavbar, onClose, fixed = false, action, duration = 5 }) => {
  const { t } = useTranslation();
 
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    if (error || successMessage) {
      setAlertVisible(true);
    } else {
      setAlertVisible(false);
    }
  }, [error, successMessage]);

  const handleComplete = () => {
    setAlertVisible(false);
    if (onClose) onClose(); 
    return { shouldRepeat: false };
  };

  if (!alertVisible) return null;

  const positionClass = fixed ? "error-alert-fixed" : "error-alert-relative";
  const offsetClass = belowNavbar ? "below-navbar" : "";

  const containerClasses = `error-alert-container ${positionClass} ${offsetClass} show-alert`;

  const renderActionElement = (timerColor: string) => (

    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      
      {action && <div>{action}</div>}

      <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={timerColor as any} 
        size={30}
        strokeWidth={3}
        onComplete={handleComplete}
      >

        {({ remainingTime }) => remainingTime}

      </CountdownCircleTimer>
      
    </div>
  );

  let content = null;

  if (successMessage) {

    content = (
      <Alert severity="success" sx={{ width: "100%", alignItems: "center" }} action={renderActionElement("#448A47")}>
        {successMessage}
      </Alert>
    );

  } else if (error) {

    let displayMessage = error.message;
    
    if (error.code === 'validation_error') {
        displayMessage = `${error.message} (${t('checkFields')})`;
    }

    content = (

      <Alert severity="error" sx={{ width: "100%", alignItems: "center" }} action={renderActionElement("#D74141")}>
        {displayMessage}
      </Alert>

    );
  }

  if (!content) return null;

  return (

    <div className={containerClasses} data-testid="alert">
      {content}
    </div>

  );
}

export default ApiErrorAlert;