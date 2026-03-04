import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import {
    CircularProgress,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RequirementItem from './RequirementItem';
import useAuthStore from '../zustand/useAuthStore';
import ApiErrorAlert from '../components/ApiErrorAlert';
import { ApiErrorResponse } from '../types/error';
import { useIsAtTop } from '../hooks/useIsAtTop';
import { MdLockReset } from 'react-icons/md';

const createResetPasswordSchema = (t: (key: string) => string) => z.object({
  password: z.string().min(8, t('passwordMinLength')),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('passwordMismatch'),
  path: ["confirmPassword"],
});

const ResetPassword = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const isAtTop = useIsAtTop(10);

    const { uid, token } = useParams<{ uid: string; token: string }>();

    const [error, setError] = useState<ApiErrorResponse | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const resetPasswordConfirm = useAuthStore(s => s.resetPassword);
    const loading = useAuthStore(s => s.loading);

    const resetPasswordSchema = createResetPasswordSchema(t);
    type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormValues>({resolver: zodResolver(resetPasswordSchema), mode: "onChange" });

    const watchedPassword = watch("password", "");

    const passwordChecks = {
        length: watchedPassword.length > 7,
        number: /\d/.test(watchedPassword),
        uppercase: /[A-Z]/.test(watchedPassword)
    };

    useEffect(() => {
        if (!uid || !token) {
            navigate('/login');
        }
    }, [uid, token, navigate]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        const isPasswordValid = Object.values(passwordChecks).every(Boolean);
        if (!isPasswordValid) return;

        setError(null);
        if (!uid || !token) return;

        try {
            await resetPasswordConfirm(uid, token, data.password);
            setSuccess(true);
            navigate("/verification-success", {state: {successMessage: t('passwordResetSuccess')}})
        } catch (err: unknown) {
            setError(err as ApiErrorResponse);
        }
    };

    if (success) {
        return (
            <div className="main-app-container">
                <ApiErrorAlert successMessage={t('passwordResetSuccess')} belowNavbar={isAtTop} fixed/>
            </div>
        );
    }

    return (
        <div className="main-app-container">

            <ApiErrorAlert error={error} fixed belowNavbar={isAtTop}/>

            <div className="auth-card-page">
                <div className="auth-card">

                    <div className="auth-card__icon-wrap">
                        <MdLockReset className="auth-card__icon" />
                    </div>

                    <h2 className="auth-card__title">{t('passwordResetTitle')}</h2>
                    <p className="auth-card__subtitle">{t('newPasswordSubtitle')}</p>

                    <form className="auth-card__form" onSubmit={handleSubmit(onSubmit)}>

                        <FormControl variant="outlined" fullWidth error={!!errors.password}>
                            <InputLabel htmlFor="new-password">{t('password')}</InputLabel>
                            <OutlinedInput
                                {...register('password')}
                                id="new-password"
                                type={showPassword ? 'text' : 'password'}
                                label={t('password')}
                                required
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                autoComplete="new-password"
                            />
                            {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                        </FormControl>

                        <FormControl variant="outlined" fullWidth error={!!errors.confirmPassword}>
                            <InputLabel htmlFor="confirm-password">{t('confirmPassword')}</InputLabel>
                            <OutlinedInput
                                {...register('confirmPassword')}
                                id="confirm-password"
                                type={showConfirm ? 'text' : 'password'}
                                label={t('confirmPassword')}
                                required
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                autoComplete="new-password"
                            />
                            {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
                        </FormControl>

                        <div className="requirements-container">
                            <RequirementItem isValid={passwordChecks.length} text={t('letters')} />
                            <RequirementItem isValid={passwordChecks.number} text={t('numbers')} />
                            <RequirementItem isValid={passwordChecks.uppercase} text={t('uppercase')} />
                        </div>

                        <button className="auth-card__btn" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={22} sx={{ color: 'white' }}/> : t('save')}
                        </button>

                    </form>

                </div>
            </div>

        </div>
    );
};


export default ResetPassword;
