import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

import registerIcon from '../assets/registerIcon.webp';
import Footer from "../components/Footer";
import ApiErrorAlert from '../components/ApiErrorAlert';
import { useIsAtTop } from '../hooks/useIsAtTop';
import GoogleLoginBtn from '../components/GoogleLoginBtn';
import NavigationSection from '../components/NavigationSection';

import RegisterForm from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';

const Register = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAtTop = useIsAtTop(10);
  
  const { form, loading, error, showPassword, passwordChecks, togglePassword, onSubmit } = useRegister();

  const loginButton = (
    <button onClick={() => navigate('/login')} className='otp-form__resend-code'>
      {t('login') || "Anmelden"}
    </button>
  );

  return (
    <>
      <div className='main-app-container'>
        <ApiErrorAlert 
          error={error} 
          belowNavbar={isAtTop} 
          fixed 
          duration={10} 
          action={error?.status === 409 ? loginButton : null}
        />

        <div className="register-container">
          <NavigationSection first_link='Register'/>

          <div className="register-form">
            <div>
              <div className="register-title-container">
                <h1>{t('joinUs')}</h1>
                <h1 className="register-title-span">{t('join')}</h1>
              </div>

              <RegisterForm 
                form={form}
                onSubmit={onSubmit}
                loading={loading}
                showPassword={showPassword}
                onTogglePassword={togglePassword}
                passwordChecks={passwordChecks}
              />
            </div>

            <div className="register-img-container">
              <img src={registerIcon} alt="" loading="lazy" className="register-img"/>
              <div className="divider-container">
                <div />
                <p>{t('or')}</p>
                <div />
              </div>
              <GoogleLoginBtn/>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Register;