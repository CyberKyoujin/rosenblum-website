import { TextField, Divider, CircularProgress } from '@mui/material';
import { useTranslation } from "react-i18next";
import { IoWarningOutline, IoSendSharp } from "react-icons/io5";
import { PiUploadFill } from "react-icons/pi";
import { FaFile } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import OrderSectionHeader from '../components/OrderSectionHeader';
import OrderInfoAccordion from '../components/OrderInfoAccordion';
import OrderFormGroup from '../components/OrderFormGroup';
import { GrContactInfo } from "react-icons/gr";
import { BiSolidMessageDetail } from "react-icons/bi";

const OrderForm = ({ logic }: { logic: any }) => {

  const { t } = useTranslation();
  const { register, formState: { errors } } = logic.methods;

  return (
    <form className="order-container" onSubmit={logic.onSubmit} style={{ marginTop: '2rem' }}>
      <OrderSectionHeader Icon={GrContactInfo} headerText={t('contactInformation')} />
      
      <div className="order-contacts-content">
        <TextField {...register('name')}  label={t('name')} fullWidth error={!!errors.name} />
        <TextField {...register('email')}  label={t('email')} fullWidth error={!!errors.email} />
        
        <div className={`phone-notification ${logic.isPhoneInvalid ? 'show-notification' : ''}`}>
          <IoWarningOutline className="warning-icon" />
          <p>{t('onlyGerman')}</p>
        </div>
        
        <TextField {...register('phone_number')}  label={t('phoneNumber')} fullWidth error={!!errors.phoneNumber} />
        <TextField {...register('city')}  label={t('city')} fullWidth error={!!errors.city} />
        <TextField {...register('street')}  label={t('street')} fullWidth error={!!errors.street} />
        <TextField {...register('zip')}  label={t('zip')} fullWidth error={!!errors.zip} />
      </div>

      <Divider style={{ height: '32px', marginTop: '1rem' }} />
      <OrderSectionHeader Icon={BiSolidMessageDetail} headerText={t('yourMessageSecond')} />
      <OrderInfoAccordion />

      <div className="order-contacts-content">
        <TextField {...register('message')} multiline rows={10} label={t('yourMessage')} fullWidth />
      </div>

      <OrderFormGroup />
      <Divider style={{ height: '32px', marginTop: '1rem' }} />
      <OrderSectionHeader Icon={PiUploadFill} headerText={t('uploadDocuments')} />

      <div className="order-contacts-content">

        <div 
          className={`file-upload ${logic.files.dragging ? 'dragging' : ''}`}
          onDrop={logic.files.onDrop}
          onDragOver={(e) => { e.preventDefault(); logic.files.setDragging(true); }}
          onDragLeave={() => logic.files.setDragging(false)}
          onClick={() => logic.files.inputRef.current?.click()}
        >
          <PiUploadFill style={{ fontSize: '50px', color: 'rgb(76, 121, 212)' }} />
          <p style={{ fontSize: '20px' }}>{t('uploadArea')}</p>
        </div>

        <input 
          type="file" multiple accept=".jpg,.png,.pdf,.doc,.docx" 
          ref={logic.files.inputRef} 
          style={{ display: 'none' }} 
          onChange={logic.files.handleInputChange} 
        />

        <div className="files-container">
          {logic.files.list.map((file: File, index: number) => (
            <div key={index} className="file-container">
              <FaFile style={{ fontSize: '40px', color: 'rgb(76, 121, 212)' }} />
              <p>{file.name.slice(0, 10)}...</p>
              <button type="button" className="file-remove-btn" onClick={() => logic.files.remove(index)}>
                <RiDeleteBin6Fill />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="send-btn hover-btn" disabled={logic.loading}>
          {logic.loading ? <CircularProgress size={24} style={{ color: "white" }} /> : <>{t('send')} <IoSendSharp /></>}
        </button>

      </div>
    </form>
  );
};

export default OrderForm;