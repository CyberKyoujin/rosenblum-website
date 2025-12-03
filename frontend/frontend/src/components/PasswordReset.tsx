import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { 
    TextField, 
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

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Der Passwort muss mindestens 8 Zeichen lang sein."), 
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Die Passwörter stimmen nicht überein", 
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const isAtTop = useIsAtTop(10);
    
    const { uid, token } = useParams<{ uid: string; token: string }>();

    const [error, setError] = useState<ApiErrorResponse | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const resetPasswordConfirm = useAuthStore(s => s.resetPassword);
    const loading = useAuthStore(s => s.loading);

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
            navigate("/verification-success", {state: {successMessage: "Ihr Passwort wurde erfolgreich geändert."}})
        } catch (err: unknown) {
            setError(err as ApiErrorResponse);
        }
    };

    if (success) {
        return (
            <div className="main-app-container">
                 <div className="register-container" style={{ textAlign: 'center', padding: '2rem' }}>
                    <ApiErrorAlert successMessage={t('passwordResetSuccess') || "Das Passwort wurde erfolgreich geändert!"} belowNavbar={isAtTop} fixed/>
                    <p style={{ marginTop: '1rem' }}>Sie werden zur Anmeldeseite weitergeleitet...</p>
                 </div>
            </div>
        );
    }

    return (
        <div className="main-app-container">
            <section className="password-reset-container">
                
                <div  className="password-reset-info">
                    <h2>{"Neues Passwort erstellen"}</h2>
                </div>
                
                <ApiErrorAlert error={error} />

                <form className="password-reset-form" onSubmit={handleSubmit(onSubmit)}>
                    
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

                    <TextField
                        {...register('confirmPassword')}
                        label={"Passwort bestätigen"}
                        type="password"
                        variant="outlined"
                        required
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        autoComplete="new-password"
                    />

                    <div className="requirements-container">
                        <RequirementItem isValid={passwordChecks.length} text={t('letters') || "Min. 8 Zeichen"} />
                        <RequirementItem isValid={passwordChecks.number} text={t('numbers') || "Mindestens eine Zahl"} />
                        <RequirementItem isValid={passwordChecks.uppercase} text={t('uppercase') || "Großbuchstaben"} />
                    </div>

                    <button className="confirm-btn" type='submit' disabled={loading}>
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }}/> : (t('save') || "Speichern")}
                    </button>

                </form>
            </section>
        </div>
    );
};


export default ResetPassword;