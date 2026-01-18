import React, { useEffect, useState } from 'react'
import OTPInput from '../components/OTPInput'
import Footer from '../components/Footer'
import { useLocation, useNavigate } from 'react-router-dom';
import useEmailVerification from '../hooks/useEmailVerification';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';

const EmailVerification = () => {

  const [code, setCode] = useState("");
  
  const { attempts, error, loading, verifyEmail, resendVerification } = useEmailVerification();

  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {email?: string} | null;
  const email = state?.email;

  useEffect(() => {

    if (!email) {
    navigate('/register');
    }

  }, [email, navigate])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verifyEmail(code, email);
  }

  const handleResendVerificationClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await resendVerification(email);
  } 

  return (
    <>
    <div className="page">

      {!loading ? (

        <div className="page">

        <form className="otp-form__container" onSubmit={handleSubmit}>

          <div className="otp-form__header">

            <h1>Email <span className="otp-form__span">Verifizierung</span></h1>

            {error && (
              <Alert severity="error">{error}</Alert>
            )}

            {(error === "Es gibt kein Verifizierungscode" || error === "Der Code ist abgelaufen" || error === "Sie haben keine Versuche übrig") && (
              <button
                className="otp-form__resend-code"
                onClick={handleResendVerificationClick}
              >
                Code erneut senden
              </button>
            )}

          </div>

          <div className='otp-form__data'>
            <p>Wir haben den Verifizierungscode auf <span className="otp-form__span">{email}</span> gesendet</p>
            <p>Sie haben noch <span className="otp-form__span">{attempts}</span> versuche</p>
          </div>

            <OTPInput value={code} onChange={setCode}/>
            <button style={{display: "block"}}type="submit" className='order-btn otp_btn' data-testid="otp-submit">Code Senden</button>

        </form>

        </div>

      ) : (
        <div className='loading-container page'>
          <CircularProgress/>
        </div>
      )
      }

      

        <Footer />

    </div>
    </>
  )
}

export default EmailVerification