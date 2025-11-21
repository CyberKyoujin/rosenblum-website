import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ApiError } from "../types/auth";
import Alert from '@mui/material/Alert';
import { ApiErrorResponse } from "../types/error";

interface ApiErrorAlertProps {
    error?: ApiErrorResponse | null;
    successMessage?: string | null;
    belowNavbar?: boolean;
    onClose?: () => void;
    fixed?: boolean;
}

const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error, successMessage, belowNavbar, onClose, fixed = false }) => {
  const [alertVisible, setAlertVisible] = useState(true);

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

  const containerClasses = `
    error-alert-container 
    ${positionClass} 
    ${offsetClass}
    show-alert
  `;

  // 1. Determine content based on what exists
  let content = null;

  if (successMessage) {
      content = (
        <Alert severity="success" sx={{ width: "100%", alignItems: "center" }}
            action={
              <CountdownCircleTimer
                isPlaying
                duration={5}
                colors={["#448A47"]}
                size={30}
                strokeWidth={3}
                onComplete={handleComplete}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            }
        >
          {successMessage}
        </Alert>
      );
  } else if (error) {
      // 2. Calculate message ONLY if error exists
      const displayMessage = error.code === 'validation_error' 
          ? `${error.message} (Check fields)` 
          : `Error ${error.status || '!'}: ${error.message}`;

      content = (
        <Alert severity="error" sx={{ width: "100%", alignItems: "center" }}
            action={
              <CountdownCircleTimer
                isPlaying
                duration={5}
                colors={["#D74141"]}
                size={30}
                strokeWidth={3}
                onComplete={handleComplete}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            }
        >
          {displayMessage}
        </Alert>
      );
  }

  if (!content) return null;

  return (
    <div className={containerClasses}>
      {content}
    </div>
  );
}

export default ApiErrorAlert;