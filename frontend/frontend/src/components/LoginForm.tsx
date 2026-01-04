import React from 'react';
import { TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LoginFormValues } from '../hooks/useLogin';

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  loading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ form, onSubmit, loading, showPassword, onTogglePassword }) => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, formState: { errors } } = form;

  return (
    
    <form className="login-form" onSubmit={onSubmit}>
      <div className="login-form-container">
        <TextField 
          {...register('email')}
          fullWidth
          id="email" 
          label="Email" 
          variant="outlined" 
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <FormControl fullWidth variant="outlined" error={!!errors.password}>
          <InputLabel htmlFor="outlined-adornment-password">{t('password')}</InputLabel>
          <OutlinedInput
            {...register('password')}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={onTogglePassword} edge="end">
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
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }}/> : t('next')}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;