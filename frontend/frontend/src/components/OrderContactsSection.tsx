import { TextField, InputAdornment } from '@mui/material';
import OrderSectionHeader from './OrderSectionHeader'
import { useTranslation } from 'react-i18next';
import { GrContactInfo } from "react-icons/gr";

export const OrderContactsSection = ({logic}: {logic?: any}) => {

  const {t} = useTranslation();

  const { register, formState: { errors } } = logic.methods;

  return (
    <>

    <OrderSectionHeader Icon={GrContactInfo} headerText={t('contactInformation')} />

      <div className="order-contacts-content">
        <TextField {...register('name')} required label={t('name')} fullWidth error={!!errors.name} />
        <TextField {...register('email')} required label={t('email')} fullWidth error={!!errors.email} />

        <TextField
          {...register('phone_number')}
          required
          label={t('phoneNumber')}
          fullWidth
          error={!!errors.phone_number}
          placeholder="123 4567890"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span className="phone-country-code">DE +49</span>
              </InputAdornment>
            ),
          }}
        />

        <TextField {...register('city')} required label={t('city')} fullWidth error={!!errors.city} />
        <TextField {...register('street')} required label={t('street')} fullWidth error={!!errors.street} />
        <TextField {...register('zip')} required label={t('zip')} fullWidth error={!!errors.zip} />
      </div>

    </>
  )
}
