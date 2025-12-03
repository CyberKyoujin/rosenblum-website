import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { 
    TextField,
    InputLabel,
    FormControl,
    IconButton,
    OutlinedInput,
    InputAdornment,
    CircularProgress,
    FormHelperText
} from '@mui/material';

import { useTranslation } from "react-i18next";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";
import { ApiErrorResponse } from '../types/error';
import ApiErrorAlert from '../components/ApiErrorAlert';
import GoogleLoginBtn from '../components/GoogleLoginBtn';
import NavigationSection from '../components/NavigationSection';

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"), 
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {

    const { t } =useTranslation();
    const navigate = useNavigate();

    const { loginUser, loading } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginFormValues>({resolver: zodResolver(loginSchema)});

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const onSubmit = async (data: LoginFormValues) => {
        setError(null);
        try {
            await loginUser(data.email, data.password);
            navigate("/profile");
        } catch (err: unknown) {
            const error = err as ApiErrorResponse;
            switch (error.code) {
                case 'authentication_failed':
                    setError({
                        ...error,
                        message: "Неверный Email или пароль. Попробуйте снова." 
                    });
                    break;
                case 'account_disabled':
                    setError({
                        ...error,
                        message: "Аккаунт не верифицирован. Пожалуйста, проверьте почту."
                    });
                    break;
                default:
                    setError(error); 
                    break;
            }
        }
    };

    const handleVerificationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const currentEmail = getValues("email");
        navigate('/email-verification', { state: { email: currentEmail } });
    }

    const verificationButton = (
        <button onClick={handleVerificationClick} className='otp-form__resend-code'>
            {"Verifizieren"}
        </button>
    );

    return (
        <div className="register-container">

            <NavigationSection first_link={t('login')}/>

            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>

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
                        <div className='login-title-footer__item'>
                            <p>{t('newClient')}</p>
                            <p className="login-span" onClick={() => navigate('/register')}>{t('register')}</p>
                        </div>
                    </div>

                    <ApiErrorAlert error={error} action={error?.code === 'account_disabled' ? verificationButton : null} duration={10}/>

                </div>

                <div className="login-form-container">
                    
                    <TextField 
                        {...register('email')}
                        required 
                        id="email" 
                        label="Email" 
                        variant="outlined" 
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <FormControl fullWidth variant="outlined" required error={!!errors.password}>
                        <InputLabel htmlFor="outlined-adornment-password">{t('password')}</InputLabel>
                        <OutlinedInput
                            {...register('password')}
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
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
                            label={t('password')}
                        />
                        {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                    </FormControl>

                    <div className='login-title-footer__item'>
                            <p>Passwort vergessen?</p>
                            <p className="login-span" onClick={() => navigate('/send-reset-password')}>Reset</p>
                    </div>

                    <button className="confirm-btn" type='submit' disabled={loading}>
                        {loading ? (<CircularProgress  sx={{ color: 'white' }}/>) : (t('next'))}
                    </button>

                </div>

            </form>

            <div className="login-img-container">

                    <div className="divider-container">
                        <div></div>
                        <p>{t('or')}</p>
                        <div></div>
                    </div>
            
                    <GoogleLoginBtn/>

            </div>



        </div>
    )
}


export default Login