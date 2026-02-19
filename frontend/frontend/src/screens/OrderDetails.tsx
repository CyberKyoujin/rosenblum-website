import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OrderDetailsSkeleton from "../components/OrderDetailsSkeleton";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import ApiErrorView from "../components/ApiErrorView";
import Footer from "../components/Footer";
import { languages } from "../hooks/useOrder";

import {
    IoDocumentTextOutline,
    IoPersonOutline,
    IoCallOutline,
    IoLocationOutline,
    IoChatbubbleOutline,
    IoAttachOutline,
    IoDownloadOutline,
    IoChevronBack
} from "react-icons/io5";
import { IoDocuments } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import { useOrderDetails } from "../hooks/useOrderDetails";
import useAuthStore from "../zustand/useAuthStore";

interface OrderDetailsProps {
    uuid?: string;
    orderPropId?: string;
}


const OrderDetails = ({ uuid, orderPropId }: OrderDetailsProps) => {
    const navigate = useNavigate();

    const { orderId } = useParams<{ orderId: string }>();

    const id =  orderPropId ?? orderId;

const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    const { t } = useTranslation();
    const isAtTop = useIsAtTop(10);

    const { loading, 
            orderData, 
            orderDetailsError, 
            statusConfig, 
            hasIndividualDocs, 
            docsTotal, 
            selectedPayment, 
            paymentLoading, 
            setSelectedPayment, 
            getOrderTypeLabel, 
            getPaymentStatusConfig, 
            getPaymentTypeLabel, 
            showPaymentAction, 
            handlePayment } = useOrderDetails(id, uuid);

    if (loading) {
        return <OrderDetailsSkeleton />;
    }

    return (
        <>
            <div className="main-app-container">
                <ApiErrorAlert error={orderDetailsError} belowNavbar={isAtTop} fixed />

                <div className="od">
                    {/* Back Button */}
                    {isAuthenticated && <button className="od__back-btn" onClick={() => navigate('/profile')}>
                        <IoChevronBack />
                        {t('backToProfile')}
                    </button>}

                    {orderDetailsError ? (
                        <ApiErrorView message={orderDetailsError?.message} />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="od__header-card">
                                <div className="od__header-content">
                                    <div className="od__header-icon">
                                        <IoDocumentTextOutline />
                                    </div>
                                    <div className="od__header-info">
                                        <h1 className="od__order-id">{`#ro-${orderData?.id}`}</h1>
                                        <p className="od__order-date">{t('orderedAt')} {orderData?.formatted_timestamp || orderData?.date}</p>
                                    </div>
                                </div>
                                <div className="od__header-badges">
                                    <div
                                        className="od__status-badge"
                                        style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                                    >
                                        <span className="od__status-dot" style={{ backgroundColor: statusConfig.color }} />
                                        {statusConfig.label}
                                    </div>
                                    {orderData?.order_type && (
                                        <div className="od__type-badge">
                                            {getOrderTypeLabel(orderData.order_type, t)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="od__card od__card--full">
                                <h3 className="od__card-title">
                                    <MdPayment className="od__title-icon" />
                                    {t('paymentInformation')}
                                </h3>
                                <div className="od__payment-info">
                                    <div className="od__info-item">
                                        <div className="od__info-content">
                                            <span className="od__info-label">{t('orderType')}</span>
                                            <span className="od__info-value">
                                                {getOrderTypeLabel(orderData?.order_type || '', t)}
                                            </span>
                                        </div>
                                    </div>
                                    {orderData?.payment_type && (
                                        <div className="od__info-item">
                                            <div className="od__info-content">
                                                <span className="od__info-label">{t('paymentMethod')}</span>
                                                <span className="od__info-value">
                                                    {getPaymentTypeLabel(orderData.payment_type, t)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="od__info-item">
                                        <div className="od__info-content">
                                            <span className="od__info-label">{t('paymentStatusLabel')}</span>
                                            {(() => {
                                                const psCfg = getPaymentStatusConfig(orderData?.payment_status || 'not_paid', t);
                                                return (
                                                    <span
                                                        className="od__payment-status-badge"
                                                        style={{ backgroundColor: psCfg.bg, color: psCfg.color }}
                                                    >
                                                        <span className="od__status-dot" style={{ backgroundColor: psCfg.color }} />
                                                        {psCfg.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {showPaymentAction && (
                                    <div className="od__pay-action">
                                        <p className="od__pay-label">{t('choosePaymentMethod')}</p>
                                        <div className="od__pay-options">
                                            <label className={`od__pay-option ${selectedPayment === 'stripe' ? 'od__pay-option--selected' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="od-payment"
                                                    value="stripe"
                                                    checked={selectedPayment === 'stripe'}
                                                    onChange={() => setSelectedPayment('stripe')}
                                                    className="od__pay-radio"
                                                />
                                                <div className="od__pay-option-content">
                                                    <span className="od__pay-option-title">{t('instantPayment')}</span>
                                                    <span className="od__pay-option-desc">{t('instantPaymentDesc')}</span>
                                                </div>
                                            </label>
                                            <label className={`od__pay-option ${selectedPayment === 'rechnung' ? 'od__pay-option--selected' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="od-payment"
                                                    value="rechnung"
                                                    checked={selectedPayment === 'rechnung'}
                                                    onChange={() => setSelectedPayment('rechnung')}
                                                    className="od__pay-radio"
                                                />
                                                <div className="od__pay-option-content">
                                                    <span className="od__pay-option-title">{t('invoiceLabel')}</span>
                                                    <span className="od__pay-option-desc">{t('invoiceDesc')}</span>
                                                </div>
                                            </label>
                                        </div>
                                        <button
                                            className="od__pay-btn"
                                            onClick={handlePayment}
                                            disabled={paymentLoading}
                                        >
                                            {paymentLoading ? t('processing') : selectedPayment === 'stripe' ? `${t('payNow')} (${docsTotal.toFixed(2)} €)` : t('requestInvoice')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Info Cards Grid */}
                            <div className="od__cards-grid">
                                {/* Contact Info Card */}
                                <div className="od__card">
                                    <h3 className="od__card-title">{t('contactInformation')}</h3>
                                    <div className="od__info-list">
                                        <div className="od__info-item">
                                            <IoPersonOutline className="od__info-icon" />
                                            <div className="od__info-content">
                                                <span className="od__info-label">{t('name')}</span>
                                                <span className="od__info-value">{orderData?.name}</span>
                                            </div>
                                        </div>
                                        <div className="od__info-item">
                                            <IoCallOutline className="od__info-icon" />
                                            <div className="od__info-content">
                                                <span className="od__info-label">{t('phone')}</span>
                                                <span className="od__info-value">{orderData?.phone_number}</span>
                                            </div>
                                        </div>
                                        <div className="od__info-item">
                                            <IoLocationOutline className="od__info-icon" />
                                            <div className="od__info-content">
                                                <span className="od__info-label">{t('address')}</span>
                                                <span className="od__info-value">{`${orderData?.street}, ${orderData?.zip} ${orderData?.city}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Card */}
                                <div className="od__card">
                                    <h3 className="od__card-title">
                                        <IoChatbubbleOutline className="od__title-icon" />
                                        {t('message')}
                                    </h3>
                                    <div className="od__message-box">
                                        {orderData?.message || t('noMessage')}
                                    </div>
                                </div>
                            </div>

                            {/* Documents Card */}
                            {orderData?.documents && orderData.documents.length > 0 && (
                                <div className="od__card od__card--full">
                                    <h3 className="od__card-title">
                                        <IoDocuments className="od__title-icon" />
                                        {t('documents')}
                                    </h3>
                                    <div className="od__docs-list">
                                        {orderData.documents.map((doc) => {
                                            const lang = languages.find(l => l.code === doc.language);
                                            return (
                                                <div key={doc.id} className="od__doc-item">
                                                    <div className="od__doc-info">
                                                        {lang && (
                                                            <img src={lang.flag} alt={lang.label} className="od__doc-flag" />
                                                        )}
                                                        <span className="od__doc-lang">{lang?.label || doc.language}</span>
                                                        <span className="od__doc-type">{doc.type}</span>
                                                    </div>
                                                    <span className="od__doc-price">
                                                        {doc.individual_price ? t('individualCalculation') : `${parseFloat(doc.price).toFixed(2)} \u20AC`}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="od__docs-footer">
                                        <div className="od__docs-total">
                                            <span>{t('total')}</span>
                                            <span className="od__docs-total-value">{docsTotal.toFixed(2)} &euro;</span>
                                        </div>
                                        {hasIndividualDocs && (
                                            <p className="od__docs-note">
                                                {t('individuallyCalculatedDocs')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Kostenvoranschlag Card */}
                            {orderData?.cost_estimate && (
                                <div className="od__card od__card--full">
                                    <h3 className="od__card-title">
                                        <IoDocumentTextOutline className="od__title-icon" />
                                        {t('costEstimate')}
                                    </h3>
                                    <div className="od__file-item">
                                        <div className="od__file-icon">
                                            <IoDocumentTextOutline />
                                        </div>
                                        <div className="od__file-info">
                                            <span className="od__file-name">{t('costEstimate')}</span>
                                            <span className="od__file-size">PDF</span>
                                        </div>
                                        <button
                                            className="od__file-download"
                                            onClick={() => window.open(orderData.cost_estimate!.file, '_blank')}
                                        >
                                            <IoDownloadOutline />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Files Card */}
                            <div className="od__card od__card--full">
                                <h3 className="od__card-title">
                                    <IoAttachOutline className="od__title-icon" />
                                    {t('data')}
                                </h3>
                                {orderData?.files && orderData.files.length > 0 ? (
                                    <div className="od__files-grid">
                                        {orderData.files.map((file, index) => (
                                            <div key={index} className="od__file-item">
                                                <div className="od__file-icon">
                                                    <IoDocumentTextOutline />
                                                </div>
                                                <div className="od__file-info">
                                                    <span className="od__file-name">
                                                        {file.file_name.length > 17? `${file.file_name.slice(0, 17)}...` : file.file_name}
                                                    </span>
                                                    <span className="od__file-size">{file.file_size} MB</span>
                                                </div>
                                                <button
                                                    className="od__file-download"
                                                    onClick={() => window.open(file.file, '_blank')}
                                                >
                                                    <IoDownloadOutline />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="od__no-files">{t('noFilesAttached')}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderDetails
