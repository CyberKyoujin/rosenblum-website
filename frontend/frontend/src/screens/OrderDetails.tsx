import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { useTranslation } from "react-i18next";
import OrderDetailsSkeleton from "../components/OrderDetailsSkeleton";
import { ApiErrorResponse } from "../types/error";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import ApiErrorView from "../components/ApiErrorView";
import Footer from "../components/Footer";

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

interface FileData {
    id: string;
    file: string;
    file_name: string;
    file_size: string;
    order: string;
}

interface OrderData {
    id: string;
    files: FileData[];
    name: string;
    email: string;
    phone_number: string;
    city: string;
    date: string;
    street: string;
    zip: string;
    message: string;
    status: string;
    user: string;
}

const getStatusConfig = (status: string, t: (key: string) => string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
        review: { label: t('beeingChecked'), color: '#92400e', bg: '#fef3c7' },
        completed: { label: t('completed'), color: '#166534', bg: '#dcfce7' },
        processing: { label: t('processing'), color: '#1e40af', bg: '#dbeafe' },
        cancelled: { label: t('cancelled'), color: '#991b1b', bg: '#fee2e2' },
    };
    return configs[status] || configs.review;
};

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(false);
    const [orderDetailsError, setOrderDetailsError] = useState<ApiErrorResponse | null>(null);

    const { t } = useTranslation();
    const isAtTop = useIsAtTop(10);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            setOrderDetailsError(null);
            try {
                const response = await axiosInstance.get(`/orders/${orderId}/`);
                setOrderData(response.data);
            } catch (err: unknown) {
                setOrderDetailsError(err as ApiErrorResponse);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return <OrderDetailsSkeleton />;
    }

    const statusConfig = getStatusConfig(orderData?.status || 'review', t);

    return (
        <>
            <div className="main-app-container">
                <ApiErrorAlert error={orderDetailsError} belowNavbar={isAtTop} fixed />

                <div className="od">
                    {/* Back Button */}
                    <button className="od__back-btn" onClick={() => navigate('/profile')}>
                        <IoChevronBack />
                        Zurück zum Profil
                    </button>

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
                                        <p className="od__order-date">{t('orderedAt')} {orderData?.date}</p>
                                    </div>
                                </div>
                                <div
                                    className="od__status-badge"
                                    style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                                >
                                    <span className="od__status-dot" style={{ backgroundColor: statusConfig.color }} />
                                    {statusConfig.label}
                                </div>
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
                                                <span className="od__info-label">Name</span>
                                                <span className="od__info-value">{orderData?.name}</span>
                                            </div>
                                        </div>
                                        <div className="od__info-item">
                                            <IoCallOutline className="od__info-icon" />
                                            <div className="od__info-content">
                                                <span className="od__info-label">Telefon</span>
                                                <span className="od__info-value">{orderData?.phone_number}</span>
                                            </div>
                                        </div>
                                        <div className="od__info-item">
                                            <IoLocationOutline className="od__info-icon" />
                                            <div className="od__info-content">
                                                <span className="od__info-label">Anschrift</span>
                                                <span className="od__info-value">{`${orderData?.street}, ${orderData?.zip} ${orderData?.city}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Card */}
                                <div className="od__card">
                                    <h3 className="od__card-title">
                                        <IoChatbubbleOutline className="od__title-icon" />
                                        Nachricht
                                    </h3>
                                    <div className="od__message-box">
                                        {orderData?.message || 'Keine Nachricht hinterlassen.'}
                                    </div>
                                </div>
                            </div>

                            {/* Files Card */}
                            <div className="od__card od__card--files">
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
                                    <p className="od__no-files">Keine Dateien angehängt.</p>
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