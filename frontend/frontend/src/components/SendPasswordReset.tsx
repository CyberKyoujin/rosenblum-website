import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { TextField, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import useAuthStore from "../zustand/useAuthStore";
import { ApiErrorResponse } from "../types/error";
import ApiErrorAlert from "./ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import { MdLockReset } from 'react-icons/md';
import { FaCircleCheck } from 'react-icons/fa6';

const createSendPasswordSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('invalidEmail')),
});

const SendPasswordReset = () => {

    const { t } = useTranslation();

    const [error, setError] = useState<ApiErrorResponse | null>(null);
    const [successfullySent, setSuccessfullySent] = useState(false);

    const loading = useAuthStore(s => s.loading);
    const sendResetLink = useAuthStore(s => s.sendResetLink);

    const isAtTop = useIsAtTop(10);

    const sendPasswordSchema = createSendPasswordSchema(t);
    type SendResetFormValues = z.infer<typeof sendPasswordSchema>;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<SendResetFormValues>({resolver: zodResolver(sendPasswordSchema)});

    const onSubmit = async (data: SendResetFormValues) => {
        setError(null);
        setSuccessfullySent(false);
        try {
            await sendResetLink(data.email);
            setSuccessfullySent(true);
            reset();
        } catch (err: unknown) {
            setError(err as ApiErrorResponse);
        }
    }

    return (
        <div className="main-app-container">

            <ApiErrorAlert error={error} fixed belowNavbar={isAtTop}/>

            <div className="auth-card-page">
                <div className="auth-card">

                    <div className="auth-card__icon-wrap">
                        <MdLockReset className="auth-card__icon" />
                    </div>

                    <h2 className="auth-card__title">{t('resetPassword')}</h2>
                    <p className="auth-card__subtitle">{t('resetPasswordSubtitle')}</p>

                    {successfullySent ? (
                        <div className="auth-card__success">
                            <FaCircleCheck className="auth-card__success-icon" />
                            <p className="auth-card__success-text">{t('resetLinkSent')}</p>
                        </div>
                    ) : (
                        <form className="auth-card__form" onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                {...register('email')}
                                label="Email"
                                variant="outlined"
                                id="email"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                required
                            />
                            <button className="auth-card__btn" type="submit" disabled={loading}>
                                {loading ? <CircularProgress size={22} sx={{ color: 'white' }}/> : t('next')}
                            </button>
                        </form>
                    )}

                </div>
            </div>

        </div>
    )
}

export default SendPasswordReset
