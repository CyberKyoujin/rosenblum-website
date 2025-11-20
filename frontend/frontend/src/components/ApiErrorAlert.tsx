import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ApiError } from "../types/auth";
import Alert from '@mui/material/Alert';
import { IoMdClose } from "react-icons/io";

interface ApiErrorAlertProps {
    error: ApiError | null;
    belowNavbar?: boolean;
}

const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error, belowNavbar }) => {
  const [alertVisible, setAlertVisible] = useState(true);

  const toggleAlert = () => setAlertVisible(false);

  useEffect(() => {
    if (!error) return;
    setAlertVisible(true); 
  }, [error]);

  if (!error || !alertVisible) return null;

  return (
    <div className={`error-alert-container ${belowNavbar ? "below-navbar" : ""} show-alert`}>
      <Alert
        severity="error"
        sx={{ width: "100%", alignItems: "center" }}
        action={
          <CountdownCircleTimer
            isPlaying
            duration={5}               
            colors={["#D74141"]}
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
        {`Error ${error.status}: ${error.message}`}
      </Alert>
    </div>
  );
};

export default ApiErrorAlert;