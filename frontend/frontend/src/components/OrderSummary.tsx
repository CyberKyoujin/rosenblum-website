import { FaFile, FaUserCircle, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaShieldAlt, FaBell, FaHistory, FaCog, FaBoxOpen } from 'react-icons/fa';
import { AiFillMessage } from 'react-icons/ai';
import { IoDocuments } from 'react-icons/io5';
import { PiUploadFill } from 'react-icons/pi';
import { MdPayment } from 'react-icons/md';
import { Divider, Checkbox } from '@mui/material';
import OrderSectionHeader from './OrderSectionHeader';
import { DocsType, languages } from '../hooks/useOrder';
import { t } from 'i18next';

const getPaymentOptions = () => [
  {
    id: 'kostenvoranschlag',
    title: t('costEstimate'),
    description: t('quoteDescription'),
  },
  {
    id: 'rechnung',
    title: t('invoiceLabel'),
    description: t('invoiceDesc'),
  },
  {
    id: 'stripe',
    title: t('instantPayment'),
    description: t('instantPaymentDesc'),
  },
];

export default function OrderSummary({ logic }: { logic: any }) {
  const values = logic.methods.getValues();
  const docs: DocsType[] = logic.docs.list;
  const files: File[] = logic.files.list;
  const selectedPayment: string = logic.payment.method;
  const hasIndividualDocs = logic.docs.specialDocs > 0;
  const reg = logic.registration;
  const { isExpress, setIsExpress, pickupMethod, setPickupMethod } = logic.orderOptions;
  const baseTotal: number = logic.docs.baseTotal;
  const expressSurcharge = isExpress ? baseTotal * 0.25 : 0;
  const postalSurcharge = pickupMethod === 'post' ? 2.20 : 0;

  return (
    <>
      <OrderSectionHeader Icon={FaUserCircle} headerText={t('contactDetails')} />

      <div className="summary-section">
        <div className="summary-grid">
          <div className="summary-field">
            <span className="summary-label">{t('name')}</span>
            <span className="summary-value">{values.name}</span>
          </div>
          <div className="summary-field">
            <span className="summary-label">{t('email')}</span>
            <span className="summary-value">{values.email}</span>
          </div>
          <div className="summary-field">
            <span className="summary-label">{t('phone')}</span>
            <span className="summary-value">+49 {values.phone_number}</span>
          </div>
          <div className="summary-field">
            <span className="summary-label">{t('city')}</span>
            <span className="summary-value">{values.city}</span>
          </div>
          <div className="summary-field">
            <span className="summary-label">{t('street')}</span>
            <span className="summary-value">{values.street}</span>
          </div>
          <div className="summary-field">
            <span className="summary-label">{t('zip')}</span>
            <span className="summary-value">{values.zip}</span>
          </div>
        </div>
      </div>

      <Divider sx={{ my: 2 }} />

      <OrderSectionHeader Icon={AiFillMessage} headerText={t('stepMessage')} />

      <div className="summary-section">
        <p className="summary-message">{values.message}</p>
      </div>

      {docs.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />

          <OrderSectionHeader Icon={IoDocuments} headerText={t('stepDocuments')} />

          <div className="summary-section">
            <div className="summary-docs">
              {docs.map((doc, idx) => (
                <div key={idx} className="summary-doc-row">
                  <span className="summary-doc-name">
                    {(() => { const lang = languages.find(l => l.code === doc.language); return lang ? <><img src={lang.flag} alt={lang.label} className="summary-doc-flag" /> {lang.label}</> : null; })()}
                    {' '}{doc.type}
                  </span>
                  <span className="summary-doc-price">
                    {doc.individualPrice ? t('individualCalculation') : `${doc.price.toFixed(2)} €`}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-doc-total">
              <span>{t('total')}</span>
              <span className="summary-doc-total-value">{logic.docs.total.toFixed(2)} €</span>
            </div>
            {logic.docs.specialDocs > 0 && (
              <p className="summary-doc-note">
                {t('specialDocsNote', { count: logic.docs.specialDocs })}
              </p>
            )}
          </div>
        </>
      )}

      {files.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />

          <OrderSectionHeader Icon={PiUploadFill} headerText={t('uploadedFiles')} />

          <div className="summary-section">
            <div className="summary-files">
              {files.map((file, idx) => (
                <div key={idx} className="summary-file">
                  <FaFile className="summary-file-icon" />
                  <span className="summary-file-name">{file.name}</span>
                  <span className="summary-file-size">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      <OrderSectionHeader Icon={FaCog} headerText={t('orderOptions')} />

      <div className="order-options-section">

        {/* Express-Auftrag */}
        <label className={`order-option-card ${isExpress ? 'order-option-card--active' : ''}`}>
          <input
            type="checkbox"
            checked={isExpress}
            onChange={e => setIsExpress(e.target.checked)}
            className="order-option-hidden-input"
          />
          <div className="order-option-card__body">
            <div className="order-option-card__left">
              <FaCog className="order-option-card__icon order-option-card__icon--express" />
              <div>
                <span className="order-option-card__title">{t('expressOrder')}</span>
                <span className="order-option-card__desc">{t('expressOrderDesc')}</span>
              </div>
            </div>
            <span className="order-option-card__badge">+25%</span>
          </div>
        </label>

        {/* Abholung */}
        <div className="order-option-pickup">
          <div className="order-option-pickup__header">
            <FaBoxOpen className="order-option-card__icon" />
            <span className="order-option-card__title">{t('pickupMethod')}</span>
          </div>
          <div className="order-option-pickup__options">
            <label className={`pickup-option ${pickupMethod === 'pick_up' ? 'pickup-option--active' : ''}`}>
              <input
                type="radio"
                name="pickup"
                value="office"
                checked={pickupMethod === 'pick_up'}
                onChange={() => setPickupMethod('pick_up')}
                className="order-option-hidden-input"
              />
              <span className="pickup-option__label">{t('pickupOffice')}</span>
            </label>
            <label className={`pickup-option ${pickupMethod === 'post' ? 'pickup-option--active' : ''}`}>
              <input
                type="radio"
                name="pickup"
                value="post"
                checked={pickupMethod === 'post'}
                onChange={() => setPickupMethod('post')}
                className="order-option-hidden-input"
              />
              <span className="pickup-option__label">{t('pickupPost')}</span>
              <span className="pickup-option__price">+2,20 €</span>
            </label>
          </div>
        </div>

        {/* Price breakdown */}
        {docs.length > 0 && (expressSurcharge > 0 || postalSurcharge > 0) && (
          <div className="order-options-breakdown">
            <div className="order-options-breakdown__row">
              <span>{t('subtotal')}</span>
              <span>{baseTotal.toFixed(2)} €</span>
            </div>
            {expressSurcharge > 0 && (
              <div className="order-options-breakdown__row order-options-breakdown__row--surcharge">
                <span>{t('expressSurcharge')}</span>
                <span>+{expressSurcharge.toFixed(2)} €</span>
              </div>
            )}
            {postalSurcharge > 0 && (
              <div className="order-options-breakdown__row order-options-breakdown__row--surcharge">
                <span>{t('postalSurcharge')}</span>
                <span>+2,20 €</span>
              </div>
            )}
          </div>
        )}

      </div>

      <Divider sx={{ my: 2 }} />

      <OrderSectionHeader Icon={MdPayment} headerText={t('paymentMethod')} />

      {hasIndividualDocs && (
        <div className="payment-hint">
          <p>{t('individualDocsPaymentHint')}</p>
        </div>
      )}

      <div className="payment-options">
        {getPaymentOptions().map((option) => {
          const disabled = hasIndividualDocs && option.id !== 'kostenvoranschlag';
          return (
            <label
              key={option.id}
              className={`payment-option ${selectedPayment === option.id ? 'payment-option--selected' : ''} ${disabled ? 'payment-option--disabled' : ''}`}
            >
              <input
                type="radio"
                name="payment"
                value={option.id}
                checked={selectedPayment === option.id}
                onChange={() => logic.payment.setMethod(option.id)}
                className="payment-option-radio"
                disabled={disabled}
              />
              <div className="payment-option-content">
                <span className="payment-option-title">{option.title}</span>
                <span className="payment-option-desc">{option.description}</span>
              </div>
            </label>
          );
        })}
      </div>

      <Divider sx={{ my: 2 }} />

      {/* Registration promo — only for guests */}
      
      {!reg.isLoggedIn && (
        <div className={`order-register-card ${reg.wantsAccount ? 'order-register-card--active' : ''}`}>
          <div className="order-register-promo">
            <div className="order-register-promo-left">
              <div className="order-register-icon-circle">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="order-register-promo-title">{t('createFreeAccount')}</h3>
                <p className="order-register-promo-desc">{t('onePasswordAway')}</p>
              </div>
            </div>
            <button
              type="button"
              className={`order-register-toggle-btn ${reg.wantsAccount ? 'order-register-toggle-btn--active' : ''}`}
              onClick={() => reg.setWantsAccount(!reg.wantsAccount)}
            >
              {reg.wantsAccount ? t('accountActivated') : t('activateAccount')}
            </button>
          </div>

          <div className="order-register-benefits">
            <div className="order-register-benefit">
              <FaHistory className="order-register-benefit-icon" />
              <span>{t('trackOrderStatus')}</span>
            </div>
            <div className="order-register-benefit">
              <FaBell className="order-register-benefit-icon" />
              <span>{t('receiveEmailNotifications')}</span>
            </div>
            <div className="order-register-benefit">
              <FaUserCircle className="order-register-benefit-icon" />
              <span>{t('prefillContactDataFuture')}</span>
            </div>
          </div>

          <div className={`order-register-fields ${reg.wantsAccount ? 'order-register-fields--open' : ''}`}>
            <div className="order-register-fields-inner">
              <div className="order-pw-field">
                <label className="order-pw-label">{t('password')}</label>
                <div className="order-pw-input-wrapper">
                  <FaLock className="order-pw-icon" />
                  <input
                    type={reg.showPassword ? 'text' : 'password'}
                    className="order-pw-input"
                    placeholder={t('enterPassword')}
                    value={reg.password}
                    onChange={(e) => reg.setPassword(e.target.value)}
                  />
                  <button type="button" className="order-pw-toggle" onClick={reg.togglePassword} tabIndex={-1}>
                    {reg.showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

              <div className="order-pw-field">
                <label className="order-pw-label">{t('confirmPassword')}</label>
                <div className="order-pw-input-wrapper">
                  <FaLock className="order-pw-icon" />
                  <input
                    type={reg.showPassword ? 'text' : 'password'}
                    className="order-pw-input"
                    placeholder={t('repeatPassword')}
                    value={reg.passwordConfirm}
                    onChange={(e) => reg.setPasswordConfirm(e.target.value)}
                  />
                </div>
                {reg.passwordConfirm && !reg.passwordsMatch && (
                  <span className="order-pw-error">{t('passwordMismatch')}</span>
                )}
              </div>

              <div className="order-pw-checks">
                {[
                  { key: 'length', label: t('minimumEightChars') },
                  { key: 'uppercase', label: t('oneCapitalLetter') },
                  { key: 'number', label: t('oneNumber') },
                ].map(({ key, label }) => (
                  <div key={key} className={`order-pw-check ${reg.passwordChecks[key] ? 'order-pw-check--pass' : ''}`}>
                    {reg.passwordChecks[key] ? <FaCheck /> : <FaTimes />}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="consent-section">
        <label className="consent-row">
          <Checkbox
            checked={logic.consent.agb}
            onChange={(e) => logic.consent.setAgb(e.target.checked)}
            sx={{ color: '#999', '&.Mui-checked': { color: 'var(--blue)' }, padding: '4px' }}
          />
          <span className="consent-text">
            {t('agreeToAGB')}
          </span>
        </label>
        <label className="consent-row">
          <Checkbox
            checked={logic.consent.datenschutz}
            onChange={(e) => logic.consent.setDatenschutz(e.target.checked)}
            sx={{ color: '#999', '&.Mui-checked': { color: 'var(--blue)' }, padding: '4px' }}
          />
          <span className="consent-text">
            {t('agreeToPrivacyPolicy')}
          </span>
        </label>
        <label className="consent-row">
          <Checkbox
            checked={logic.consent.widerrufsrecht}
            onChange={(e) => logic.consent.setWiderrufsrecht(e.target.checked)}
            sx={{ color: '#999', '&.Mui-checked': { color: 'var(--blue)' }, padding: '4px' }}
          />
          <span className="consent-text">
            {t('agreeToWiderrufsrecht')}
          </span>
        </label>
      </div>
    </>
  );
}