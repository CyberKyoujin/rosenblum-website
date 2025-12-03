import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { TextField, InputLabel, FormControl, IconButton, OutlinedInput, InputAdornment, FormHelperText, CircularProgress} from '@mui/material';
import { useTranslation } from "react-i18next";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import registerIcon from '../assets/registerIcon.webp'
import Footer from "../components/Footer";
import useAuthStore from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ApiErrorResponse } from '../types/error';
import ApiErrorAlert from '../components/ApiErrorAlert';
import { useIsAtTop } from '../hooks/useIsAtTop';
import GoogleLoginBtn from '../components/GoogleLoginBtn';
import RequirementItem from '../components/RequirementItem';
import NavigationSection from '../components/NavigationSection';

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(1, "Password is required"), 
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const isAtTop = useIsAtTop(10);

    const registerUser = useAuthStore(s => s.registerUser);
    const loading = useAuthStore(s => s.loading);

    const [error, setError] = useState<ApiErrorResponse | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {register, handleSubmit, watch, formState: {errors}} = useForm<RegisterFormValues>({resolver: zodResolver(registerSchema), mode: "onChange"});

    const watchedPassword = watch("password", "");

    const passwordChecks = {
        length: watchedPassword.length > 7,
        number: /\d/.test(watchedPassword),
        uppercase: /[A-Z]/.test(watchedPassword)
    };

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    const onSubmit = async (data: RegisterFormValues) => {

        if (!isPasswordValid) return; 

        setError(null);
        try {
            await registerUser(data.email, data.firstName, data.lastName, data.password);
            navigate('/email-verification', { state: { email: data.email } });
        } catch (err: unknown) {
            const error = err as ApiErrorResponse;
            
            if (error.status === 409) {
                setError({
                    ...error,
                    message: t('userAlreadyExists') || "Пользователь с таким email уже зарегистрирован."
                });
            } else {
                setError(error);
            }

        }
    };

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


                <NavigationSection first_link='Register'/>

                <div className="register-form">

                    <div>

                        <div className="register-title-container">
                            <h1>{t('joinUs')}</h1>
                            <h1 className="register-title-span">{t('join')}</h1>
                        </div>

                        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
                            
                            <TextField
                                {...register('email')}
                                label="Email"
                                variant="outlined"
                                error={!!errors.email}
                                helperText={errors.email?.message} 
                            />

                            <TextField
                                {...register('firstName')}
                                label={t('firstName')}
                                variant="outlined"
                                error={!!errors.firstName}
                            />

                            <TextField
                                {...register('lastName')}
                                label={t('lastName')}
                                variant="outlined"
                                error={!!errors.lastName}
                            />

                            <FormControl fullWidth variant="outlined" error={!!errors.password}>
                                <InputLabel htmlFor="outlined-adornment-password">{t('password')}</InputLabel>
                                <OutlinedInput
                                    {...register('password')}
                                    id="pass"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label={t('password')}
                                />
                                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                            </FormControl>

                            <div className="requirements-container">
                                <RequirementItem isValid={passwordChecks.length} text={t('letters')} />
                                <RequirementItem isValid={passwordChecks.number} text={t('numbers')} />
                                <RequirementItem isValid={passwordChecks.uppercase} text={t('uppercase')} />
                            </div>

                            <button className="confirm-btn" type='submit' disabled={loading}>
                                {loading ? (<CircularProgress size={24} sx={{ color: '#ffffff' }}/>) : (t('next'))}
                            </button>
                            
                        </form>

                    </div>

                    <div className="register-img-container">

                        <img src={registerIcon} alt="" loading="lazy" className="register-img"/>

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