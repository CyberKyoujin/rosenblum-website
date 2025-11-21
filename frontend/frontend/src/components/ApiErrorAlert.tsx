import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ApiError } from "../types/auth";
import Alert from '@mui/material/Alert';

interface ApiErrorAlertProps {
    error?: ApiError | null;
    successMessage?: string | null;
    success?: boolean;
    belowNavbar?: boolean;
}

const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error, successMessage, success, belowNavbar }) => {
  const [alertVisible, setAlertVisible] = useState(true);

  const toggleAlert = () => setAlertVisible(false);

  useEffect(() => {
    if (error || successMessage) {
      setAlertVisible(true);
    }
  }, [error, successMessage]);

  const hasContent = !!error || !!successMessage;
  if (!hasContent || !alertVisible) return null;

  const isSuccess = !!successMessage && !error;

  return (
    <div className={`error-alert-container ${belowNavbar ? "below-navbar" : " "} show-alert`}>
      <Alert
        severity={successMessage ? "success" : "error"}
        sx={{ width: "100%", alignItems: "center" }}
        action={
          <CountdownCircleTimer
            isPlaying
            duration={5}               
            colors={successMessage ? ["#448A47"] : ["#D74141"]}
            size={30}
            strokeWidth={3}
            onComplete={() => {
              toggleAlert();
              return { shouldRepeat: false };
            }}
          >

            {({ remainingTime }) => remainingTime}

          </CountdownCircleTimer>
        }
      >
        {isSuccess ? successMessage: `Error ${error?.status}: ${error?.message}`}

      </Alert>
    </div>
  );
};

export default ApiErrorAlert;