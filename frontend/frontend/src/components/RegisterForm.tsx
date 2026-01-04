import React from 'react';
import { TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import RequirementItem from '../components/RequirementItem';
import { RegisterFormValues } from '../hooks/useRegister';

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  loading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  passwordChecks: { length: boolean; number: boolean; uppercase: boolean };
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  form, onSubmit, loading, showPassword, onTogglePassword, passwordChecks 
}) => {
  const { t } = useTranslation();
  const { register, formState: { errors } } = form;

  return (
    <form className="form-container" onSubmit={onSubmit}>
      <TextField
        {...register('email')}
        label="Email"
        variant="outlined"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message} 
      />

      <TextField
        {...register('firstName')}
        label={t('firstName')}
        variant="outlined"
        fullWidth
        error={!!errors.firstName}
      />

      <TextField
        {...register('lastName')}
        label={t('lastName')}
        variant="outlined"
        fullWidth
        error={!!errors.lastName}
      />

      <FormControl fullWidth variant="outlined" error={!!errors.password}>
        <InputLabel htmlFor="pass">{t('password')}</InputLabel>
        <OutlinedInput
          {...register('password')}
          id="pass"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={onTogglePassword} edge="end">
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
        {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }}/> : t('next')}
      </button>
    </form>
  );
};

export default RegisterForm;