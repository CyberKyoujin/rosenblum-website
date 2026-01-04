import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import  useAuthStore from '../zustand/useAuthStore';
import { ApiErrorResponse } from '../types/error';

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useLogin = () => {

  const { loginUser, loading } = useAuthStore();
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      await loginUser(data.email, data.password);
      navigate("/profile");
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      
      const errorMap: Record<string, string> = {
        'authentication_failed': "Неверный Email или пароль. Попробуйте снова.",
        'account_disabled': "Аккаунт не верифицирован. Пожалуйста, проверьте почту."
      };

      setError({
        ...apiError,
        message: errorMap[apiError.code] || apiError.message
      });
    }
  };

  const handleVerificationRedirect = () => {
    const currentEmail = form.getValues("email");
    navigate('/email-verification', { state: { email: currentEmail } });
  };

  return {
    form,
    loading,
    error,
    showPassword,
    togglePassword,
    handleVerificationRedirect,
    onSubmit: form.handleSubmit(onSubmit)
  };
};