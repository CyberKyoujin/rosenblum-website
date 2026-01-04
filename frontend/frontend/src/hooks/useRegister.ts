import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from "react-i18next";
import useAuthStore from '../zustand/useAuthStore';
import { ApiErrorResponse } from '../types/error';

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(1, "Password is required"), 
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerUser = useAuthStore(s => s.registerUser);
  const loading = useAuthStore(s => s.loading);

  const [error, setError] = useState<ApiErrorResponse | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const watchedPassword = form.watch("password", "");

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
      const apiError = err as ApiErrorResponse;
      if (apiError.status === 409) {
        setError({
          ...apiError,
          message: t('userAlreadyExists') || "Пользователь с таким email уже зарегистрирован."
        });
      } else {
        setError(apiError);
      }
    }
  };

  return {
    form,
    loading,
    error,
    showPassword,
    passwordChecks,
    togglePassword: () => setShowPassword(!showPassword),
    onSubmit: form.handleSubmit(onSubmit)
  };
};