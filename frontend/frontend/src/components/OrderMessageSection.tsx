import { TextField } from '@mui/material'
import { t } from 'i18next'

import { BiSolidMessageDetail } from 'react-icons/bi'
import OrderInfoAccordion from './OrderInfoAccordion'
import OrderSectionHeader from './OrderSectionHeader'

export default function OrderMessageSection({logic}: {logic: any}) {

  const { register, formState: { errors } } = logic.methods;

  return (
    <>
      <OrderSectionHeader Icon={BiSolidMessageDetail} headerText={t('yourMessageSecond')} />
      <OrderInfoAccordion />

      <div className="order-contacts-content">
        <TextField
          {...register('message')}
          required
          multiline
          rows={10}
          label={t('yourMessage')}
          fullWidth
          error={!!errors.message}
          placeholder={t('messagePlaceholder')}
        />
      </div>
    </>
  )
}
