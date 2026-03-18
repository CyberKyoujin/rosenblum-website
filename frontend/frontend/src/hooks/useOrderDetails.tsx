import { useCallback, useEffect, useState } from "react";
import { ApiErrorResponse } from "../types/error";
import { OrderData } from "../types/orders";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toApiError } from "../axios/toApiError";


export const useOrderDetails = (orderId?: string, uuid?: string) => {

    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [orderDetailsError, setOrderDetailsError] = useState<ApiErrorResponse | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<string>('stripe');
    const [paymentLoading, setPaymentLoading] = useState(false);

    const navigate = useNavigate();

    const { t } = useTranslation();

    const getStatusConfig = (status: string, t: (key: string) => string) => {
        const configs: Record<string, { label: string; color: string; bg: string }> = {
            review:              { label: t('status_review'),              color: '#92400e', bg: '#fef3c7' },
            in_progress:         { label: t('status_in_progress'),         color: '#1e40af', bg: '#dbeafe' },
            completed:           { label: t('status_completed'),           color: '#166534', bg: '#dcfce7' },
            ready_pick_up:       { label: t('status_ready_pick_up'),       color: '#7c3aed', bg: '#ede9fe' },
            sent:                { label: t('status_sent'),                color: '#0369a1', bg: '#e0f2fe' },
            canceled:            { label: t('status_canceled'),            color: '#991b1b', bg: '#fee2e2' },
            waiting_for_payment: { label: t('status_waiting_for_payment'), color: '#92400e', bg: '#fef3c7' },
        };
        return configs[status] || configs.review;
    };

    const getOrderTypeLabel = (type: string, t: (key: string) => string) => {
        const labels: Record<string, string> = {
            kostenvoranschlag: t('orderType_kostenvoranschlag'),
            order: t('orderType_order'),
        };
        return labels[type] || type;
    };

    const getPaymentTypeLabel = (type: string, t: (key: string) => string) => {
        const labels: Record<string, string> = {
            rechnung: t('paymentType_rechnung'),
            stripe: t('paymentType_stripe'),
        };
        return labels[type] || type;
    };

    const getPaymentStatusConfig = (status: string, t: (key: string) => string) => {
        const configs: Record<string, { label: string; color: string; bg: string }> = {
            paid:            { label: t('paymentStatus_paid'),       color: '#166534', bg: '#dcfce7' },
            not_paid:        { label: t('paymentStatus_not_paid'), color: '#92400e', bg: '#fef3c7' },
            payment_pending: { label: t('paymentStatus_pending'),    color: '#1e40af', bg: '#dbeafe' },
        };
        return configs[status] || configs.not_paid;
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            setOrderDetailsError(null);
            try {

                const response = await axiosInstance.get(`/orders/${orderId}/`, { params: { uuid: uuid || undefined } });
                setOrderData(response.data);
            } catch (err: unknown) {
                setOrderDetailsError(toApiError(err));
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const showPaymentAction = orderData?.order_type !== 'kostenvoranschlag'
        && orderData?.payment_status !== 'paid'
        && orderData?.payment_type !== 'rechnung';

    const statusConfig = getStatusConfig(orderData?.status || 'review', t);
    const docsTotal = orderData?.documents
        ?.filter(d => !d.individual_price)
        .reduce((sum, d) => sum + parseFloat(d.price), 0) || 0;
    const hasIndividualDocs = orderData?.documents?.some(d => d.individual_price) || false;

    const handlePayment = useCallback(async () => {
        if (!orderData) return;

        const total = orderData.documents
            ?.filter(d => !d.individual_price)
            .reduce((sum, d) => sum + parseFloat(d.price), 0) || 0;

        if (selectedPayment === 'stripe') {
            try {
                setPaymentLoading(true);
                await axiosInstance.patch(`/orders/${orderId}/`, {
                    payment_type: 'stripe',
                }, { params: { uuid: uuid || undefined } });
                navigate('/payment', { state: { total, orderId } });
            } catch (err: unknown) {
                setOrderDetailsError(toApiError(err));
            } finally {
                setPaymentLoading(false);
            }
        } else if (selectedPayment === 'rechnung') {
            try {
                setPaymentLoading(true);
                await axiosInstance.patch(`/orders/${orderId}/`, {
                    payment_type: 'rechnung',
                }, { params: { uuid: uuid || undefined } });
                navigate('/order-success', { state: { orderId, type: 'rechnung' } });
            } catch (err: unknown) {
                setOrderDetailsError(toApiError(err));
            } finally {
                setPaymentLoading(false);
            }
        }
    }, [orderData, selectedPayment, orderId, navigate]);

    return {
        orderData,
        setOrderData,
        loading,
        setLoading,
        orderDetailsError,
        setOrderDetailsError,
        selectedPayment,
        setSelectedPayment,
        paymentLoading,
        setPaymentLoading,
        getStatusConfig,
        getOrderTypeLabel,
        getPaymentStatusConfig,
        getPaymentTypeLabel,
        showPaymentAction,
        statusConfig,
        docsTotal,
        hasIndividualDocs,
        handlePayment,
    }

}