import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link'
import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import registerIcon from '../assets/registerIcon.png'
import tick from '../assets/tick.svg'
import cross from '../assets/cross.svg'
import Footer from "../components/Footer";
import useAuthStore from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { ApiErrorResponse } from '../types/error';
import ApiErrorAlert from '../components/ApiErrorAlert';
import { useIsAtTop } from '../hooks/useIsAtTop';
import GoogleLoginBtn from '../components/GoogleLoginBtn';

const Register = () => {

    const registerUser = useAuthStore(s => s.registerUser);
    const loading = useAuthStore(s => s.loading);

    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const [containsCharacters, setContainsCharacters] = useState(false);
    const [containsNumbers, setContainsNumbers] = useState(false);
    const [containsUppercase, setContainsUppercase] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isAtTop = useIsAtTop(10);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const checkPassword = (currentPassword: string) => {
        setContainsCharacters(currentPassword.length > 7);
        setContainsNumbers(/\d/.test(currentPassword));
        setContainsUppercase(/[A-Z]/.test(currentPassword));
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError(null);

        try {

            await registerUser(email, firstName, lastName, password);
            navigate('/email-verification', {state: {email}});

        } catch (err: unknown) {

            const error  = err as ApiErrorResponse;

            if (error.status === 409) {
                
                setError({
                ...error,    
                message: t('userAlreadyExists') || "Пользователь с таким email уже зарегистрирован."
            });

            } else {

                setError(error);

            }
        }
               
    }

    const loginButton = (
    <button onClick={() => navigate('/login')} className='otp-form__resend-code'>
        {t('login') || "Anmelden"}
    </button>
    );

    return (
        <>
            
        <div className='main-app-container'>

            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed duration={10} action={error?.status === 409 ? loginButton : null}/>

            <div className="register-container">


                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/">{t('home')}</Link>
                    <Typography color="text.primary">{t('register')}</Typography>
                    </Breadcrumbs>
                </div>

                <div className="register-form">

                    <div>

                        <div className="register-title-container">
                            <h1>{t('joinUs')}</h1>
                            <h1 className="register-title-span">{t('join')}</h1>
                        </div>

                        <form className="form-container" onSubmit={handleSubmit}>
                            
                            <TextField required id="outlined-basic1" label="Email" variant="outlined" onChange={(e) => {setEmail(e.target.value)}}/>

                            <TextField required id="outlined-basic2" label={t('firstName')} variant="outlined" onChange={(e) => {setFirstName(e.target.value)}}/>

                            <TextField required id="outlined-basic3" label={t('lastName')} variant="outlined" onChange={(e) => {setLastName(e.target.value)}}/>

                            <FormControl fullWidth variant="outlined" required>
                                <InputLabel htmlFor="outlined-adornment-password">{t('password')}</InputLabel>
                                <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => {
                                    const newPassword = e.target.value;
                                    setPassword(newPassword); 
                                    checkPassword(newPassword); 
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                />
                            </FormControl>

                            <div className="requirements-container">
                                <p><img src={containsCharacters ? tick : cross} alt="" style={{width: '25px'}}/>{t('letters')}</p>
                                <p><img src={containsNumbers ? tick : cross} alt="" style={{width: '25px'}}/>{t('numbers')}</p>
                                <p><img src={containsUppercase ? tick : cross} alt="" style={{width: '25px'}}/>{t('uppercase')}</p>
                            </div>

                            <button className="confirm-btn" type='submit'>
                                {loading ? (<CircularProgress  sx={{ color: '#ffffff' }}/>) : (t('next'))}
                            </button>
                            
                        </form>

                    </div>

                    <div className="register-img-container">

                        <img src={registerIcon} alt="" className="register-img"/>

                        <div className="divider-container">
                            <div></div>
                            <p>{t('or')}</p>
                            <div></div>
                        </div>

                    <GoogleLoginBtn/>

                    </div>

                </div>
                            
            </div>
        
            </div>

        <Footer/>

        </>
    )
}


export default Register