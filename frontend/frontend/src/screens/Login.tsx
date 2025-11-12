import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";
import { IoWarningOutline } from "react-icons/io5";
import { Link as RouterLink } from 'react-router-dom';
import useEmailVerification from '../hooks/useEmailVerification';


const clientId = "675268927786-p5hg3lrdsm61rki2h6dohkcs4r0k5p40.apps.googleusercontent.com";

const Login = () => {

    const { t } =useTranslation(); 
    const { loginUser, googleLogin } = useAuthStore.getState();
    const {verifyEmail} = useEmailVerification();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await loginUser(email, password);
        } catch (error: any){
            if(error.response.status === 401){
                setError(t('userNotExists'));
                setPopupVisible(true);
            }

            if (error.response.status === 403){
                setError("Account not virified.")
            }
        }
    }

    useEffect(() => {
        const googleSinginButton = document.getElementById("google-signin-btn");
        if (googleSinginButton instanceof HTMLButtonElement) { 
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
          });
      
          window.google.accounts.id.renderButton(
            googleSinginButton,
            { theme: "", size: "large" }
          );
        } else {
          console.error('Google sign-in button element not found');
        }

        console.log(error);
      }, []);

    const handleCredentialResponse = (response: any) => {
        console.log(response.credential);
        googleLogin(response.credential);
    };

    const handleVerificationClick = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigate('/email-verification', {state: {email}});
    }

    return (
        <div className="register-container">

            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">{t('home')}</Link>
                <Typography color="text.primary">{t('login')}</Typography>
                </Breadcrumbs>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>

                <div className="login-title-container">

                    <div className="login-title-header">

                   

                            <div style={{display: 'flex', gap: "0.5rem"}}>
                                <h1>{t('already')}</h1>
                                <h1 className="register-title-span">{t('client')}</h1>
                            </div>

                            <span></span>

                            

                            <h1>{t('LoginNow')}.</h1>

                    </div>

                    

                    <div className="login-title-footer">
                        <p>{t('newClient')}</p>
                        <p className="login-span" onClick={() => {navigate('/register'); setPopupVisible(false);}}>{t('register')}</p>
                    </div>

                    <div className={error ? 'register-error-popup show-error' : 'register-error-popup'}> 
                        <IoWarningOutline className='error-icon'/>
                        <p>{error}</p>
                        <button className='otp-form__resend-code' onClick={handleVerificationClick}>Verfizieren</button>
                    </div>

                </div>

                <div className="login-form-container">
                    
                    
                    <TextField required id="outlined-basic" label="Email" variant="outlined" onChange={(e) => {setEmail(e.target.value); setPopupVisible(false);}}/>


                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel htmlFor="outlined-adornment-password">{t('password')}</InputLabel>
                        <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => {
                            const newPassword = e.target.value;
                            setPassword(newPassword); 
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        />
                    </FormControl>

                    <button className="confirm-btn" type='submit'>{t('next')}</button>

                </div>
                

                

            </form>

            <div className="login-img-container">
                    <div className="divider-container">
                        <div></div>
                        <p>{t('or')}</p>
                        <div></div>
                    </div>

            
                    <button id="google-signin-btn" className="custom-google-sign-in-button">Sign in with Google</button>
            </div>



        </div>
    )
}


export default Login