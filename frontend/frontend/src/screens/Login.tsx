import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import NavigationSection from '../components/NavigationSection';
import ApiErrorAlert from '../components/ApiErrorAlert';
import GoogleLoginBtn from '../components/GoogleLoginBtn';
import LoginForm from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';
import Footer from '../components/Footer';

const Login = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { form, loading, error, showPassword, togglePassword, handleVerificationRedirect, onSubmit } = useLogin();

  const verificationButton = (
    <button onClick={handleVerificationRedirect} className='otp-form__resend-code'>
      {"Verifizieren"}
    </button>
  );

  return (
    <>
    <div className="register-container">

      <NavigationSection first_link={t('login')}/>

      <div className="login-title-container">
        <div className="login-title-header">
          <div style={{display: 'flex', gap: "0.5rem"}}>
            <h1>{t('already')}</h1>
            <h1 className="register-title-span">{t('client')}</h1>
          </div>
          <h1>{t('LoginNow')}.</h1>
        </div>

        <div className="login-title-footer">
          <div className='login-title-footer__item'>
            <p>{t('newClient')}</p>
            <p className="login-span" onClick={() => navigate('/register')}>{t('register')}</p>
          </div>
        </div>

        <ApiErrorAlert 
          error={error} 
          action={error?.code === 'account_disabled' ? verificationButton : null} 
          duration={10}
        />

      </div>

      <LoginForm 
        form={form}
        onSubmit={onSubmit}
        loading={loading}
        showPassword={showPassword}
        onTogglePassword={togglePassword}
      />

      <div className="login-img-container">

        <div className="divider-container">
          <div></div>
          <p>{t('or')}</p>
          <div></div>
        </div>

        <GoogleLoginBtn/>

      </div>

    </div>

    <Footer/>
    </>
  );
};

export default Login;