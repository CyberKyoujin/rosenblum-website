import React, { useEffect, useState } from 'react'
import OTPInput from '../components/OTPInput'
import Footer from '../components/Footer'
import { useLocation, useNavigate } from 'react-router-dom';
import useEmailVerification from '../hooks/useEmailVerification';
import { CircularProgress } from '@mui/material';
import { FaEnvelope } from 'react-icons/fa';

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

  const needsResend = error === "Es gibt kein Verifizierungscode"
    || error === "Der Code ist abgelaufen"
    || error === "Sie haben keine Versuche übrig";

  return (
    <>
      <div className="ev">

          <div className="ev__card">
            <div className="ev__icon-circle">
              <FaEnvelope />
            </div>

            <h1 className="ev__title">E-Mail Verifizierung</h1>
            <p className="ev__desc">
              Wir haben einen 6-stelligen Code an <strong>{email}</strong> gesendet.
              Geben Sie ihn unten ein.
            </p>

            {error && (
              <div className="ev__error">
                {error}
              </div>
            )}

            <form className="ev__form" onSubmit={handleSubmit}>
              <OTPInput value={code} onChange={setCode} />

              <div className="ev__attempts">
                Verbleibende Versuche: <strong>{attempts}</strong>
              </div>

              <button
                type="submit"
                className="ev__submit"
                disabled={code.length < 6}
                data-testid="otp-submit"
              >
                {loading ? <CircularProgress sx={{ color: 'white' }} /> : "Bestätigen"}    
              </button>
            </form>

            <div className="ev__footer">
              {needsResend ? (
                <button
                  className="ev__resend ev__resend--error"
                  onClick={handleResendVerificationClick}
                >
                  Neuen Code senden
                </button>
              ) : (
                <p className="ev__resend-text">
                  Keinen Code erhalten?{' '}
                  <button
                    className="ev__resend"
                    onClick={handleResendVerificationClick}
                  >
                    Erneut senden
                  </button>
                </p>
              )}
            </div>
          </div>

        

      </div>
      <Footer />
    </>
  )
}

export default EmailVerification