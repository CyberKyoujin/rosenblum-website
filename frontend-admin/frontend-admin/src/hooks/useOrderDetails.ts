import { SetStateAction, useEffect, useState } from "react";
import { Order } from "../types/order";
import { useNavigate } from "react-router-dom";

export interface DocumentEdit {
    id: number | string;
    type: string;
    language: string;
    price: string;
    individual_price: boolean;
}

interface UseOrderDetailsReturn {
    formActive: boolean;
    status: string;
    orderType: string;
    paymentStatus: string;
    notificationOpen: boolean;
    documentPrices: DocumentEdit[];
    setFormActive: React.Dispatch<SetStateAction<boolean>>;
    setStatus: React.Dispatch<SetStateAction<string>>;
    setOrderType: React.Dispatch<SetStateAction<string>>;
    setPaymentStatus: React.Dispatch<SetStateAction<string>>;
    setNotificationOpen: React.Dispatch<SetStateAction<boolean>>;
    setDocumentPrices: React.Dispatch<SetStateAction<DocumentEdit[]>>;
    addDocument: () => void;
    removeDocument: (id: number | string) => void;
    fetchUserOrder: () => Promise<void>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleDelete: () => Promise<void>;
}

export const useOrderDetails = (

    orderData: Order | null,
    fetchOrder: (id: number) => Promise<void>,
    formattedOrderId: number,
    updateOrder: (id: number, status: string, order_type: string, payment_status: string, documents: DocumentEdit[]) => Promise<void>,
    deleteOrder: (id: number) => Promise<void>,

    ) : UseOrderDetailsReturn => {

    const navigate = useNavigate();

    const [formActive, setFormActive] = useState<boolean>(false);
    const [status, setStatus] = useState<string>(orderData?.status || "review");
    const [orderType, setOrderType] = useState<string>(orderData?.order_type || "order");
    const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<string>(orderData?.payment_status || 'not_paid');

    const buildDocumentEdits = (docs: Order['documents'] | undefined): DocumentEdit[] => {
        if (!docs) return [];
        return docs.map(d => ({ id: d.id, type: d.type, language: d.language, price: d.price, individual_price: d.individual_price }));
    };

    const [documentPrices, setDocumentPrices] = useState<DocumentEdit[]>(
        buildDocumentEdits(orderData?.documents)
    );

    const addDocument = () => {
        setDocumentPrices(prev => {
            const minId = `new-${crypto.randomUUID()}`
            return [...prev, { id: minId, type: 'Sonstige', language: 'ua', price: '0.00', individual_price: false }];
        });
    };

    const removeDocument = (id: number | string) => {
        setDocumentPrices(prev => prev.filter(dp => dp.id !== id));
    };

    useEffect(() => {
        if (orderData?.documents) {
            setDocumentPrices(buildDocumentEdits(orderData.documents));
        }
    }, [orderData?.documents]);

    useEffect(() => {
        if (orderData) {
            setStatus(orderData.status || 'review');
            setOrderType(orderData.order_type || 'order');
            setPaymentStatus(orderData.payment_status || 'not_paid');
        }
    }, [orderData]);

    const fetchUserOrder = async () => {
        try {
            await fetchOrder(formattedOrderId);
        } catch (_) { /* error is set in store */ }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateOrder(formattedOrderId, status, orderType, paymentStatus, documentPrices);
            await fetchUserOrder();
            setFormActive(false);
        } catch (_) { /* error is set in store, form stays open */ }
    };

    const handleDelete = async () => {
        try {
            await deleteOrder(formattedOrderId);
            navigate('/dashboard', { state: { message: "Order successfully deleted!" } });
            setNotificationOpen(false);
        } catch (_) { /* error is set in store */ }
    };

    return {
        formActive,
        setFormActive,
        status,
        orderType,
        setOrderType,
        setStatus,
        paymentStatus,
        setPaymentStatus,
        notificationOpen,
        setNotificationOpen,
        documentPrices,
        setDocumentPrices,
        addDocument,
        removeDocument,
        fetchUserOrder,
        handleSubmit,
        handleDelete
    };

}